import HtmlXmlWrapper from './HtmlXmlWrapper.js';
import parseXmlNodeTree from '../xmlParser/index.js';

class HtmlParser {
    /**
     * Parses HTML and provides an interface for immediate queries
     *
     * @param {!string} markup The downloaded HTML from a page
     * @param {string?} url Optional that indicates the URL which the page came from
     */
    constructor(markup, url) {
        this.markup_xml = parseXmlNodeTree(markup);
        this.url = (url === undefined) ? undefined : new URL(String(url));
        if (this.url) {
            // Clone URL, but discard .pathname
            this.base = new URL(String(this.url));
            this.base.pathname = '';
        }
        const baseXmlFromHtml = this.markup_xml.findAllNestedChildrenByTagName('base').next().value;
        const baseFromHtml = (baseXmlFromHtml === undefined) ? undefined : baseXmlFromHtml.getAttribute('href');
        if (baseFromHtml !== undefined) {
            this.base = new URL(baseFromHtml);
        }
    }

    toString() {
        return this.markup_xml.toString();
    }

    /**
     *
     * @param {!string} url The URL from the page
     * @returns {HtmlXmlWrapper} A wrapper containing
     */
    resolveUrl(url) {
        if (url === undefined || url === null) {
            return new URL('');
        }
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return new URL(String(url));
        }
        if (url.startsWith('/')) {
            const urlCopy = new URL(String(this.url || this.base || ''));
            urlCopy.pathname = url;
            return urlCopy;
        }
        const urlCopy = new URL(String(this.base || this.url || ''));
        if (!urlCopy.pathname.endsWith('/')) {
            urlCopy.pathname += '/';
        }
        urlCopy.pathname += url;
        return urlCopy;
    }

    get wrapper() {
        return new HtmlXmlWrapper(this, this.markup_xml);
    }
}

export default HtmlParser;
