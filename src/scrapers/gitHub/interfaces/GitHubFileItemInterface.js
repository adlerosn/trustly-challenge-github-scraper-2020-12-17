export default class GitHubFileItemInterface {
    constructor(kind, link) {
        this.kind = kind;
        this.link = link;
    }

    /**
     * Resolves the internal link.
     *
     * @param {DownloaderResponse} downloaderResponse The downloaded that downloaded the page that had this link.
     */
    resolveInternalLink(downloaderResponse) {
        this.link = downloaderResponse.downloader.filterUrl(this.link).toString();
    }
}
