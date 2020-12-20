import AbstractDownloader from './AbstractDownloader.js';
import axios from 'axios';
import DownloaderResponse from './DownloaderResponse.js';

export default class AxiosDownloader extends AbstractDownloader {
    // eslint-disable-next-line no-unused-vars
    async get(url_, options) { // options isn't needed right now; implement later if it's the case
        const filteredUrl = this.filterUrl(url_);
        const { status, data } = await axios.get(filteredUrl.toString(), {
        });
        return new DownloaderResponse(
            new AxiosDownloader(filteredUrl),
            status,
            data,
        );
    }
}
