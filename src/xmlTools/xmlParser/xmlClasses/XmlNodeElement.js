import { escapeHtml } from '../../escapers.js';
import XmlNode from './XmlNode.js';

class XmlNodeElement extends XmlNode {
    /**
     * Constructs a Node Element
     *
     * @param {string} tag The tag name of the node
     * @param {object?} attributes The attributes of the node
     * @param {Array<XmlNode>?} children The children of the node
     */
    constructor(tag, attributes, children) {
        super();
        this.tag = tag;
        this.attributes = attributes || {};
        this.children = children || [];
    }

    getAttributesSerialized() {
        return Object.entries(this.attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('');
    }

    toString() {
        return (this.children.length > 0) ? (
            `<${this.tag}${this.getAttributesSerialized()}>${this.children.map((child) => child.toString()).join('')
            }</${this.tag}>`
        ) : (
            `<${this.tag}${this.getAttributesSerialized()} />`
        );
    }

    innerText(separator) {
        return this.innerTexts().join(separator);
    }

    innerTexts() {
        return this.children.flatMap((child) => child.innerTexts());
    }

    /**
     * @override
     * @returns {string[]} The classes of the node
     */
    getClasses() {
        return (this.attributes.class || '').split(' ').filter((cls) => cls.length > 0);
    }

    /**
     * @override
     * @param {string} attr The HTML attribute to be checked
     * @returns {string?} The content of such attribute
     */
    getAttribute(attr) {
        return (this.attributes || {})[attr];
    }

    /**
     * @override
     * @param {string} tagName The tag name to be checked
     * @returns {boolean} Whether the tag is named this way or not
     */
    isTagNamed(tagName) {
        return this.tag === tagName;
    }

    /**
     * @override
     * @param {string!} id The id of the element
     * @returns {XmlNodeElement?} The classes of the node
     */
    findById(id) {
        if (this.getAttribute('id') === id) {
            return this;
        }
        let result;
        this.children.find((child) => {
            result = child.findById(id);
            return result !== undefined;
        });
        return result;
    }

    /**
     * @override
     * @param {string!} cls The class name to be searched for
     * @returns {XmlNodeElement[]} The matching Node Elements
     */
    findAllChildrenByClass(cls) {
        return this.children.filter((child) => child.hasClass(cls));
    }

    /**
     * @override
     * @param {string!} tagName The tag name to be searched for
     * @returns {XmlNodeElement[]} The matching Node Elements
     */
    findAllChildrenByTagName(tagName) {
        return this.children.filter((child) => child.isTagNamed(tagName));
    }

    /**
     * @override
     * @param {string!} cls The class name to be searched for
     * @yields {XmlNodeElement} The matching Node Elements
     */
    * findAllNestedChildrenByClass(cls) {
        if (this.hasClass(cls)) yield this;
        // eslint-disable-next-line no-restricted-syntax
        for (const child of this.children) {
            // eslint-disable-next-line no-restricted-syntax
            for (const match of child.findAllNestedChildrenByClass(cls)) {
                yield match;
            }
        }
    }

    /**
     * @override
     * @param {string!} tagName The tag name to be searched for
     * @yields {XmlNodeElement} The matching Node Elements
     */
    * findAllNestedChildrenByTagName(tagName) {
        if (this.isTagNamed(tagName)) yield this;
        // eslint-disable-next-line no-restricted-syntax
        for (const child of this.children) {
            // eslint-disable-next-line no-restricted-syntax
            for (const match of child.findAllNestedChildrenByTagName(tagName)) {
                yield match;
            }
        }
    }
}

export default XmlNodeElement;
