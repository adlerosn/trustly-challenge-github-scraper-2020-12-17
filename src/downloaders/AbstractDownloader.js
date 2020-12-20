import { ValueError } from '../exceptions/index.js';

/**
 * @abstract
 */
export default class AbstractDownloader {
    /**
     * @param {URL|string?} url The URL from the previous request
     */
    constructor(url) {
        if (url !== undefined) this.referenceUrl = new URL(String(url));
    }

    /**
     * @param {string} url A relative or full URL
     * @returns {URL} The sanitized URL
     * @throws {ValueError} When the URL cannot be sanitized
     */
    filterUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return new URL(String(url));
        }
        if (url.startsWith('/') && this.referenceUrl !== undefined) {
            const clonedUrl = new URL(String(this.referenceUrl));
            clonedUrl.pathname = url;
            return clonedUrl;
        }
        throw new ValueError(`URL cannot be resolved: ${url}`);
    }

    /**
     * Downloads an URL and returns its response
     *
     * @abstract
     * @async
     * @param {URL|string} url The URL to be retrieved
     * @param {object?} options The options for the downloader
     * @returns {DownloaderResponse} The downloaded contents
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    async get(url, options) {
        throw new Error('Abstract method was not overridden.');
    }
}
