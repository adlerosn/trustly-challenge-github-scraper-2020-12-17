import AbstractDownloader from './AbstractDownloader.js';
import DownloaderResponse from './DownloaderResponse.js';
import got from 'got';

export default class GotDownloader extends AbstractDownloader {
    // eslint-disable-next-line no-unused-vars
    async get(url_, options) { // options isn't needed right now; implement later if it's the case
        const filteredUrl = this.filterUrl(url_);
        const { statusCode, body, url } = await got(filteredUrl, {
            retry: 0,
            throwHttpErrors: false,
            'user-agent': undefined,
        });
        return new DownloaderResponse(
            new GotDownloader(url),
            statusCode,
            body,
        );
    }
}
