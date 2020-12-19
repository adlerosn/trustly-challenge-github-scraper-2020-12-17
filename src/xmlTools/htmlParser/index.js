import HtmlParser from './HtmlParser.js';
/**
 * Parses HTML and provides an interface for queries
 *
 * @param {!string} markup The downloaded HTML from a page
 * @param {string?} url Optional that indicates the URL which the page came from
 * @returns {HtmlXmlWrapper} A wrapper that provides an interface for queries
 */
function parseHtml(markup, url) {
    return (new HtmlParser(markup, url)).wrapper;
}

export default parseHtml;
