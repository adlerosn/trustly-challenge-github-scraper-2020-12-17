import AbstractScrapablePage from '../AbstractScrapablePage.js';
import { unescape as htmlUnescape } from 'html-escaper';

const REGEX_SIZE_DISK = /([\d]+(?:\.\d+)?) ?(B|KB|MB|GB|TB|PB)/;
const REGEX_FILE_LEN = /(\d+) lines \((\d+) sloc\)/;
const SIZE_MAGNITUDE = {
    B: 1,
    KB: 10 ** 3,
    MB: 10 ** 6,
    GB: 10 ** 9,
    TB: 10 ** 12,
    PB: 10 ** 15,
};

export default class GitHubFileDetail extends AbstractScrapablePage {
    /**
     * @override
     * @static
     * @param {!string} pageHtml The already-downloaded web page
     * @returns {!boolean} Whether the page represents a file detail or not
     */
    static doesHtmlRepresentThis(pageHtml) {
        return pageHtml.includes(' id="raw-url"'); // a#raw-url is only present at this page
    }

    preExtractData() {
        const filename = htmlUnescape(
            this.pageHtml
                .split('final-path')[1] // split at this class
                .split('>', 2)[1].split('<', 1)[0], // get the content that lies between the split tag
        );
        const extension = filename.includes('.', 1) ? filename.split('.').reverse()[0].toLowerCase() : 'noExtension/';
        const smallerFragment = this.pageHtml
            .split(' id="raw-url"', 1)[0] // Keep the markup before the download button
            .split('class="text-mono').reverse()[0] // Keep markup at right of monospaced div with pre-button text
            .split('</div>', 1)[0]; // Everything we want is in this div
        const usefulDataButFormatted = smallerFragment
            .substr(smallerFragment.indexOf('>') + 1) // Now remove what the uncleared remainder of the div
            .replaceAll('</span>', '') // remove closing spans
            .replaceAll(/<span[^>]*>/g, '') // remove opening spans
            .split('\n') // split lines; some of which are empty
            .map((line) => line.trim()) // trim lines
            .filter((line) => line.length > 0); // remove empty lines
        // Sample content: [ 'executable file', '110 lines (95 sloc)', '2.45 KB' ]
        let lines = 0;
        let sloc = 0;
        let bytes = 0;
        usefulDataButFormatted.forEach((formattedData) => {
            if (formattedData.includes('lines') && formattedData.includes('sloc')) {
                const [linesString, slocString] = formattedData.match(REGEX_FILE_LEN).slice(1, 3);
                lines = Number(linesString);
                sloc = Number(slocString);
            } else if (formattedData.includes('Bytes')
                || formattedData.includes('KB')
                || formattedData.includes('MB')
                || formattedData.includes('GB')
                || formattedData.includes('TB')
                || formattedData.includes('PB')
            ) {
                const [numericSizeString, unitString] = formattedData.match(REGEX_SIZE_DISK).slice(1, 3);
                bytes = Math.round(Number(numericSizeString) * SIZE_MAGNITUDE[unitString]);
            }
        });
        super.preExtractData();
        this.preExtractedData.data = {
            filename,
            extension,
            bytes,
            lines,
            sloc,
            quantity: 1,
        };
    }
}
