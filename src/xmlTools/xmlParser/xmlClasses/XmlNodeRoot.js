import XmlNodeElement from './XmlNodeElement.js';

/**
 * Root node for a XML
 */
class XmlNodeRoot extends XmlNodeElement {
    /**
     * Constructs a root node for a XML
     *
     * @param {XmlNode[]} children The children of the node
     */
    constructor(children) {
        super('', {}, children);
    }

    toString() {
        return this.children.map((child) => child.toString()).join('');
    }
}

export default XmlNodeRoot;
