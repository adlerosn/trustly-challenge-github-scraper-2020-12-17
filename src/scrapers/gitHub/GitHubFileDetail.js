import AbstractScrapablePage from '../AbstractScrapablePage.js';

class GitHubFileDetail extends AbstractScrapablePage {
    /**
     * @static
     * @param {HtmlXmlWrapper} htmlXmlWrapper The already-downloaded web page
     * @returns {boolean} Whether the page represents a file detail or not
     */
    static doesHtmlRepresentThis(htmlXmlWrapper) {
        return htmlXmlWrapper.findById('raw-url').next().value !== undefined;
    }

    preExtractData() {
        const filesBox = this.htmlXmlWrapper.findAllNestedChildrenByClass('Details').next().value;
        const files = [...filesBox.findAllNestedChildrenByClass('Box-row')];
        console.log(files);
    }
}

export default GitHubFileDetail;
