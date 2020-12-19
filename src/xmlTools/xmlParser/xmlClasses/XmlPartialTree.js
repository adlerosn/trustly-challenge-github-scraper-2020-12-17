class XmlPartialTree {
    /**
     * Returns the partial result of a parsing tree
     *
     * @param {XmlNode?} xmlNode The parsed XML Node
     * @param {XmlToken[]} xmlTokens The remaining XML Tokens to parse
     */
    constructor(xmlNode, xmlTokens) {
        this.xmlNode = xmlNode;
        this.xmlTokens = xmlTokens;
    }
}

export default XmlPartialTree;
