/**
 * @interface
 */
export default class DownloaderResponse {
    /**
     * Constructs a download response for a download done externally from this interface.
     *
     * @param {AbstractDownloader} downloader The downloader, preconfigured for running from this page.
     * @param {number} statusCode The HTTP status code; 200 is good, everything else is "evil".
     * @param {string} body The text body the server replied.
     */
    constructor(downloader, statusCode, body) {
        this.downloader = downloader;
        this.statusCode = statusCode;
        this.body = body;
    }

    /**
     * Constructs a download response... but with no response!
     * Useful for bootstraping.
     *
     * @param {AbstractDownloader} downloader The downloader, preconfigured for running the next page.
     * @returns {DownloaderResponse} The no-response downloader response.
     */
    static getInstanceWithNoResponse(downloader) {
        return new DownloaderResponse(downloader, 200, '');
    }
}
