import { escapeHtml } from '../../escapers.js';
import XmlNode from './XmlNode.js';

class XmlNodeText extends XmlNode {
    /**
     * Constructs a Text Node
     *
     * @param {!string} text The text that will the node represents
     */
    constructor(text) {
        super();
        this.text = text;
    }

    toString() {
        return escapeHtml(this.text);
    }

    // eslint-disable-next-line no-unused-vars
    innerText(separator) {
        return this.text;
    }

    innerTexts() {
        return [this.text];
    }
}

export default XmlNodeText;
