import AbstractScrapablePage from '../AbstractScrapablePage.js';
import { GitHubFileItemInterface } from './interfaces/index.js';
import { unescape as htmlUnescape } from 'html-escaper';

export default class GitHubFileListing extends AbstractScrapablePage {
    /**
     * @override
     * @static
     * @param {!string} pageHtml The already-downloaded web page
     * @returns {!boolean} Whether the page represents a file detail or not
     */
    static doesHtmlRepresentThis(pageHtml) {
        return pageHtml.includes(' id="files"'); // h2#files is only present at this page
    }

    preExtractData() {
        const fileBoxes = this.pageHtml
            .split(' class="Box-row Box-row--focus-gray') // splits at the DIV that represents a
            .slice(1) // Discard previous markup
            .map((line) => line.split('</a>', 1)[0]); // discard any markup after the first link is done
        const kindLinkPairs = fileBoxes.flatMap((fileBox) => {
            const isParent = fileBox.split('href="').reverse()[0].includes('>. .</span>');
            if (isParent) return [];
            const isSubmodule = fileBox.includes('aria-label="Submodule"');
            const isDirectory = fileBox.includes('aria-label="Directory"');
            const isFile = fileBox.includes('aria-label="File"');
            const kindLinkPair = new GitHubFileItemInterface(
                (
                    (isSubmodule ? 'submodule' : '')
                    + (isDirectory ? 'directory' : '')
                    + (isFile ? 'file' : '')
                ),
                htmlUnescape(
                    fileBox
                        .split('href="').reverse()[0] // discard everything before the start of the href
                        .split('"', 1)[0], // discard everything after the end of the href
                ), // and unescape it as regular text
            );
            return [kindLinkPair];
        });
        super.preExtractData();
        this.preExtractedData.listing = kindLinkPairs;
    }
}
