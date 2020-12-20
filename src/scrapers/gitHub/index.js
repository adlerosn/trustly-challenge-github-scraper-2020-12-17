import AbstractScrapablePage from '../AbstractScrapablePage.js';
import GitHubFileDetail from './GitHubFileDetail.js';
import GitHubFileListing from './GitHubFileListing.js';

const KNOWN_PAGE_CLASSES = [
    AbstractScrapablePage, // Hack for the IDE type the array right
    GitHubFileDetail,
    GitHubFileListing,
];

/**
 * Detects the page fed to the function and, if known, return a ScrapablePage instance for it.
 *
 * @param {!HtmlXmlWrapper} htmlXmlWrapper The already-downloaded web page
 * @returns {AbstractScrapablePage?} The scrapable page
 */
function autodiscoverGitHubPage(htmlXmlWrapper) {
    const PageType = KNOWN_PAGE_CLASSES.slice(1).find((cls) => cls.doesHtmlRepresentThis(htmlXmlWrapper));
    return (PageType !== undefined) ? new PageType(htmlXmlWrapper) : undefined;
}

export { autodiscoverGitHubPage, GitHubFileDetail, GitHubFileListing };
