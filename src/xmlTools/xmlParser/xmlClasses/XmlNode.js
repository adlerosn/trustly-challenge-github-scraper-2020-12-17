/**
 * @abstract
 */
class XmlNode {
    /**
     * Gets the inner text joined by the separator
     *
     * @abstract
     * @param {string?} separator The separator
     * @returns {string} The joined inner texts
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    innerText(separator) { throw new Error('Cannot invoke abstract method'); }

    /**
     * Gets the inner texts
     *
     * @abstract
     * @returns {string[]} The inner texts
     */
    // eslint-disable-next-line class-methods-use-this
    innerTexts() { throw new Error('Cannot invoke abstract method'); }

    /**
     * Gets classes from a node
     *
     * @returns {string[]} The classes of the node
     */
    // eslint-disable-next-line class-methods-use-this
    getClasses() {
        return [];
    }

    /**
     * Checks if class exists in this node
     *
     * @param {string} cls The HTML class to be checked
     * @returns {boolean} Whether the class is in this node or not
     */
    hasClass(cls) {
        return this.getClasses().includes(cls);
    }

    /**
     * Gets attribute that exists in this node
     *
     * @param {string} attribute The HTML attribute to be checked
     * @returns {string?} The content of such attribute
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    getAttribute(attribute) {
        return undefined;
    }

    /**
     * Checks if attribute exists in this node
     *
     * @param {string} attribute The HTML attribute to be checked
     * @returns {boolean} Whether the atribute exists in this node or not
     */
    hasAttribute(attribute) {
        return this.getAttribute(attribute) !== undefined;
    }

    /**
     * Checks if tag is named as given
     *
     * @param {string} tagName The tag name to be checked
     * @returns {boolean} Whether the tag is named this way or not
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    isTagNamed(tagName) {
        return false;
    }

    /**
     * Finds an element by ID
     *
     * @param {string!} id The id of the element
     * @returns {XmlNodeElement?} The classes of the node
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    findById(id) {
        return undefined;
    }

    /**
     * Searches immediate children for class
     *
     * @param {string!} cls The class name to be searched for
     * @returns {XmlNodeElement[]} The matching Node Elements
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    findAllChildrenByClass(cls) {
        return [];
    }

    /**
     * Searches immediate children for tag name
     *
     * @param {string!} tagName The tag name to be searched for
     * @yields {XmlNodeElement} The matching Node Elements
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars, no-empty-function
    * findAllChildrenByTagName(tagName) { }

    /**
     * Searches self and nested children for class
     *
     * @param {string!} cls The class name to be searched for
     * @returns {XmlNodeElement[]} The matching Node Elements
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    findAllNestedChildrenByClass(cls) {
        return [];
    }

    /**
     * Searches self and nested children for class
     *
     * @param {string!} tagName The tag name to be searched for
     * @yields {XmlNodeElement} The matching Node Elements
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars, no-empty-function
    * findAllNestedChildrenByTagName(tagName) { }
}

export default XmlNode;
