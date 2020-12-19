class HtmlXmlWrapper {
    /**
     * Receives parsed HTML and provides an interface for immediate queries
     *
     * @param {!HtmlParser} htmlParser The HTML Parser
     * @param {!XmlNode} xmlTree The XML Node being queried
     */
    constructor(htmlParser, xmlTree) {
        this.htmlParser = htmlParser;
        this.xmlTree = xmlTree;
    }

    toString() {
        return this.xmlTree.toString();
    }

    /**
     * @returns {URL} The resolved URL
     */
    getAbsoluteHref() {
        return this.htmlParser.resolveUrl(this.xmlTree.getAttribute('href'));
    }

    /**
     * @param {string} tagName The tag name to be queried
     * @yields {HtmlXmlWrapper} The wrapped response
     */
    * getImmediateChildrenTag(tagName) {
        if ((tagName || '').length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const result of this.xmlTree.findAllChildrenByTagName(tagName)) {
                yield new HtmlXmlWrapper(this.htmlParser, result);
            }
        }
    }

    /**
     * @param {string} tagName The tag name to be queried
     * @yields {HtmlXmlWrapper} The wrapped response
     */
    * getRecursiveChildrenTag(tagName) {
        if ((tagName || '').length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const result of this.xmlTree.findAllNestedChildrenByTagName(tagName)) {
                yield new HtmlXmlWrapper(this.htmlParser, result);
            }
        }
    }

    /**
     * @param {string} cls The class name to be queried
     * @yields {HtmlXmlWrapper} The wrapped response
     */
    * getImmediateChildrenClass(cls) {
        if ((cls || '').length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const result of this.xmlTree.findAllChildrenByClass(cls)) {
                yield new HtmlXmlWrapper(this.htmlParser, result);
            }
        }
    }

    /**
     * @param {string} cls The class name to be queried
     * @yields {HtmlXmlWrapper} The wrapped response
     */
    * getRecursiveChildrenClass(cls) {
        if ((cls || '').length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const result of this.xmlTree.findAllNestedChildrenByClass(cls)) {
                yield new HtmlXmlWrapper(this.htmlParser, result);
            }
        }
    }

    /**
     * Gets the inner text joined by the separator
     *
     * @param {string?} separator The separator
     * @returns {string} The joined inner texts
     */
    innerText(separator) {
        return this.xmlTree.innerText(separator);
    }

    /**
     * Gets the inner texts
     *
     * @returns {string[]} The inner texts
     */
    innerTexts() {
        return this.xmlTree.innerTexts();
    }

    /**
     * @param {string!} id The ID to be searched for
     * @yields {HtmlXmlWrapper} The wrapped response
     */
    * findById(id) {
        const result = this.xmlTree.findById(id);
        if (result !== undefined) {
            yield new HtmlXmlWrapper(this.htmlParser, result);
        }
    }

    /**
     * @returns {string[]} The classes of the node
     */
    getClasses() {
        return this.xmlTree.getClasses();
    }

    /**
     * @param {string} attr The HTML attribute to be checked
     * @returns {string?} The content of such attribute
     */
    getAttribute(attr) {
        return this.xmlTree.getAttribute(attr);
    }

    /**
     * @param {string} tagName The tag name to be checked
     * @returns {boolean} Whether the tag is named this way or not
     */
    isTagNamed(tagName) {
        return this.xmlTree.isTagNamed(tagName);
    }
}

export default HtmlXmlWrapper;
