import XmlNodeElement from './XmlNodeElement.js';
import XmlPartialTree from './XmlPartialTree.js';
import XmlTokenTag from './XmlTokenTag.js';

class XmlTokenTagSelfClosing extends XmlTokenTag {
    toString() {
        return `<${this.tag}${this.getAttributesSerialized()} />`;
    }

    /**
     * @override
     * @param {XmlToken[]} nextTokens The next tokens to be added
     * @returns {XmlPartialTree} The partial token tree
     */
    buildNodeTreeInternal(nextTokens) {
        return new XmlPartialTree(new XmlNodeElement(this.tag, this.attributes, []), nextTokens);
    }
}

export default XmlTokenTagSelfClosing;
