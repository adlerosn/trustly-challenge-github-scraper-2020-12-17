/**
 * Represents a scrapable page which data will be extracted
 *
 * @abstract
 */
export default class AbstractScrapablePage {
    /**
     * @param {!string} pageHtml The already-downloaded web page
     */
    constructor(pageHtml) {
        this.pageHtml = pageHtml;
        this.preExtractData();
    }

    preExtractData() {
        this.preExtractedData = { data: undefined, listing: [] };
    }

    getData() {
        return this.preExtractedData.data;
    }

    getListing() {
        return this.preExtractedData.listing;
    }

    /**
     * @abstract
     * @static
     * @param {!string} pageHtml The already-downloaded web page
     * @returns {!boolean} Whether the page represents a file detail or not
     */
    // eslint-disable-next-line no-unused-vars
    static doesHtmlRepresentThis(pageHtml) {
        return false;
    }
}
