class AbstractScrapablePage {
    /**
     * @param {HtmlXmlWrapper} htmlXmlWrapper The already-downloaded web page
     */
    constructor(htmlXmlWrapper) {
        this.htmlXmlWrapper = htmlXmlWrapper;
        this.preExtractData();
    }

    // eslint-disable-next-line class-methods-use-this
    preExtractData() { }
}

export default AbstractScrapablePage;
