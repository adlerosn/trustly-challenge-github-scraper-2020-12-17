import { escapeHtml } from '../../escapers.js';
import XmlNodeText from './XmlNodeText.js';
import XmlPartialTree from './XmlPartialTree.js';
import XmlToken from './XmlToken.js';

class XmlTokenData extends XmlToken {
    /**
     * Constructs a XML Text Token
     *
     * @param {!string} text The text that will the token represents
     */
    constructor(text) {
        super();
        this.text = text;
    }

    toString() {
        return escapeHtml(this.text);
    }

    /**
     * @override
     * @param {XmlToken[]} nextTokens The next tokens to be added
     * @returns {XmlPartialTree} The partial token tree
     */
    buildNodeTreeInternal(nextTokens) {
        return new XmlPartialTree(new XmlNodeText(this.text), nextTokens);
    }
}

export default XmlTokenData;
