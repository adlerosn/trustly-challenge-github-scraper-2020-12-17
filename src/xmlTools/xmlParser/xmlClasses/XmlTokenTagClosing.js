import XmlPartialTree from './XmlPartialTree.js';
import XmlTokenTag from './XmlTokenTag.js';

class XmlTokenTagClosing extends XmlTokenTag {
    toString() {
        return `</${this.tag}>`;
    }

    /**
     * @override
     * @param {XmlToken[]} nextTokens The next tokens to be added
     * @returns {XmlPartialTree} The partial token tree
     */
    // eslint-disable-next-line class-methods-use-this
    buildNodeTreeInternal(nextTokens) {
        return new XmlPartialTree(undefined, nextTokens);
    }
}

export default XmlTokenTagClosing;
