import { AxiosDownloader, GotDownloader } from './downloaders/index.js';
import process from 'process';

const NODE_PORT = Math.round(Number(process.env.PORT)) || 8000;
const DEFAULT_HTTP_DOWNLOADER = {
    axios: AxiosDownloader,
    got: GotDownloader,
}[process.env.DEFAULT_HTTP_DOWNLOADER] || GotDownloader;
const REQUEST_MAX_DOWNLOAD_CONNECTIONS = Math.max(1,
    Math.round(Number(process.env.REQUEST_MAX_DOWNLOAD_CONNECTIONS))) || 1;
const GITHUB_PAGE_CACHE_MAX_SIZE = Math.max(0,
    Math.round(Number(process.env.GITHUB_PAGE_CACHE_MAX_SIZE))) || 25000;
const GITHUB_FINAL_RESULT_CACHE_MAX_SIZE = Math.max(0,
    Math.round(Number(process.env.GITHUB_FINAL_RESULT_CACHE_MAX_SIZE))) || 200;

export {
    NODE_PORT,
    REQUEST_MAX_DOWNLOAD_CONNECTIONS,
    DEFAULT_HTTP_DOWNLOADER,
    GITHUB_PAGE_CACHE_MAX_SIZE,
    GITHUB_FINAL_RESULT_CACHE_MAX_SIZE,
};
