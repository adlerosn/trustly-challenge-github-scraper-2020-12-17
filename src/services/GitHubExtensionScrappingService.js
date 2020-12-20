import {
    DEFAULT_HTTP_DOWNLOADER, GITHUB_FINAL_RESULT_CACHE_MAX_SIZE, GITHUB_PAGE_CACHE_MAX_SIZE,
    REQUEST_MAX_DOWNLOAD_CONNECTIONS,
} from '../runtimeConstants.js';

import { autodiscoverGitHubPage } from '../scrapers/gitHub/index.js';
import DownloaderResponse from '../downloaders/DownloaderResponse.js';
import { DownloadingError } from '../exceptions/index.js';
import { InMemoryCache } from '../caching/index.js';
import { Job } from './interfaces/index.js';

const FINAL_RESULT_CACHE = new InMemoryCache(GITHUB_FINAL_RESULT_CACHE_MAX_SIZE);
const PAGE_CACHE = new InMemoryCache(GITHUB_PAGE_CACHE_MAX_SIZE);

export default class GitHubExtensionScrappingService {
    /**
     * @param {!string} repository The repository to be checked
     * @returns {Promise<object>} The scraped data
     */
    static async scrapeGitHubRepository(repository) {
        const previousFinalResult = FINAL_RESULT_CACHE.getKey(repository);
        if (previousFinalResult !== undefined) {
            return previousFinalResult;
        }
        const finalResults = await this.scrapeGitHubRepositoryWithoutFinalResultCaching(repository);
        FINAL_RESULT_CACHE.putKey(repository, finalResults);
        return finalResults;
    }

    /**
     * @param {!string} repository The repository to be checked
     * @returns {Promise<object>} The scraped data
     */
    static async scrapeGitHubRepositoryWithoutFinalResultCaching(repository) {
        const initialResponse = DownloaderResponse.getInstanceWithNoResponse(
            new DEFAULT_HTTP_DOWNLOADER('https://github.com/'),
        );
        const jobQueue = [Job.build(
            () => initialResponse.downloader.get(repository),
            initialResponse.downloader.filterUrl(repository).toString(),
            false,
        )]; // Job is defined, but not started
        const linkKindLists = {
            file: [],
            directory: [],
            submodule: [],
        };
        const fileInfos = [];
        while (jobQueue.length > 0) {
            // Ensure next REQUEST_MAX_DOWNLOAD_CONNECTIONS were started if not cached
            for (let i = 0; i < Math.min(REQUEST_MAX_DOWNLOAD_CONNECTIONS, jobQueue.length); i += 1) {
                if (!(jobQueue[i].workload instanceof Promise)) {
                    const isFuturePageCached = PAGE_CACHE.getKey(jobQueue[i].fetchUrl) !== undefined;
                    if (isFuturePageCached) {
                        jobQueue[i].isCached = true;
                    } else {
                        jobQueue[i].workload = jobQueue[i].workload();
                    }
                }
            }
            const { workload, fetchUrl, isCached } = jobQueue.shift();
            let gitHubPage;
            if (isCached) {
                PAGE_CACHE.repristinateKey(fetchUrl);
                gitHubPage = PAGE_CACHE.getKey(fetchUrl);
            } else {
                // eslint-disable-next-line no-await-in-loop
                gitHubPage = await this.downloadGitHubPage(workload, fetchUrl);
            }
            if (gitHubPage !== undefined) {
                this.processGitHubPage(gitHubPage, fetchUrl, linkKindLists, fileInfos, jobQueue);
            }
        }
        const foundExtensions = fileInfos
            .map(({ extension }) => extension)
            .filter((value, index, array) => !array.includes(value, index + 1));
        const statistics = Object.fromEntries(foundExtensions.map((it) => [it, {
            bytes: 0, lines: 0, sloc: 0, quantity: 0,
        }]));
        fileInfos.forEach((fileInfo) => {
            statistics[fileInfo.extension].sloc += fileInfo.sloc;
            statistics[fileInfo.extension].lines += fileInfo.lines;
            statistics[fileInfo.extension].bytes += fileInfo.bytes;
            statistics[fileInfo.extension].quantity += fileInfo.quantity;
        });
        return {
            links: linkKindLists,
            statistics,
        };
    }

    static async downloadGitHubPage(downloaderResponsePromise, fetchedUrl) {
        const downloaderResponse = await downloaderResponsePromise;
        if (downloaderResponse.statusCode !== 200) {
            throw new DownloadingError(
                `Status Code ${downloaderResponse.statusCode} at `
                + `${String(downloaderResponse.downloader.referenceUrl)}`,
            );
        }
        const gitHubPage = autodiscoverGitHubPage(downloaderResponse.body);
        (gitHubPage || { getListing: () => [] }).getListing().forEach(
            (item) => item.resolveInternalLink(downloaderResponse),
        );
        if (gitHubPage !== undefined) {
            PAGE_CACHE.putKey(fetchedUrl, gitHubPage);
        }
        return gitHubPage;
    }

    /**
     * @private
     * @param {AbstractScrapablePage} gitHubPage The GitHub page's processed data
     * @param {string} fetchedUrl The URL the page object came from
     * @param {object} linkKindLists The list of URLs for each link kind (file, directory and submodule)
     * @param {GitHubFileItemInterface[]} fileInfos The list of file informations collected
     * @param {Job[]} jobQueue The Job Queue
     */
    static processGitHubPage(gitHubPage, fetchedUrl, linkKindLists, fileInfos, jobQueue) {
        if (gitHubPage.getListing().length > 0) {
            // If has a file list, then what has been fetched was a directory
            if (!linkKindLists.directory.includes(fetchedUrl)) {
                linkKindLists.directory.push(fetchedUrl);
            }
            gitHubPage.getListing().forEach((/** @type {GitHubFileItemInterface} */ item) => {
                const linkKindList = linkKindLists[item.kind] || [];
                if (!linkKindList.includes(item.link)) linkKindList.push(item.link);
                if (item.kind !== 'submodule') {
                    jobQueue.push(Job.build(
                        () => (new DEFAULT_HTTP_DOWNLOADER()).get(item.link),
                        item.link,
                        false,
                    ));
                }
            });
        } else if (gitHubPage.getData() !== undefined) {
            // If has no file list but has a description, then what has been fetched was a file
            if (!linkKindLists.file.includes(fetchedUrl)) {
                linkKindLists.file.push(fetchedUrl);
            }
            fileInfos.push(gitHubPage.getData());
        } // then what has been fetched was an unrecognized page that will be ignored
    }
}
