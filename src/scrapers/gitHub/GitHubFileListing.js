import AbstractScrapablePage from '../AbstractScrapablePage.js';

class GitHubFileListing extends AbstractScrapablePage {
    /**
     * @static
     * @param {HtmlXmlWrapper} htmlXmlWrapper The already-downloaded web page
     * @returns {boolean} Whether the page represents a file detail or not
     */
    static doesHtmlRepresentThis(htmlXmlWrapper) {
        return htmlXmlWrapper.findById('files').next().value !== undefined;
    }

    preExtractData() {
        this.htmlXmlWrapper;
    }
}

export default GitHubFileListing;
