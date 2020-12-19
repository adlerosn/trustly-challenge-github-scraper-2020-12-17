import XmlPartialTree from './XmlPartialTree.js';
import XmlTokenTag from './XmlTokenTag.js';

class XmlTokenTagComment extends XmlTokenTag {
    // eslint-disable-next-line class-methods-use-this
    toString() {
        return '';
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

export default XmlTokenTagComment;
