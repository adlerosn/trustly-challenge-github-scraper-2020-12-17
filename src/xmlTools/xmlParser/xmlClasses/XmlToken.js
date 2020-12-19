import XmlNodeRoot from './XmlNodeRoot.js';

/**
 * @abstract
 */
class XmlToken {
    /**
     * Builds a node tree from token list
     *
     * @param {XmlToken[]} nextTokens_ The next tokens to be added
     * @returns {XmlNodeRoot} The token tree
     */
    buildNodeTree(nextTokens_) {
        const builtNodes = [];
        let currentToken = this;
        let nextTokens = nextTokens_;
        while (currentToken !== undefined) {
            const partialTree = currentToken.buildNodeTreeInternal(nextTokens);
            if (partialTree.xmlNode !== undefined) { // if could build a tree
                builtNodes.push(partialTree.xmlNode); // store the tree
                [currentToken, ...nextTokens] = partialTree.xmlTokens; // go to next token
            } else { // if couldn't build a tree
                [currentToken, ...nextTokens] = nextTokens; // ignore this problematic token and continue
            }
        }
        return new XmlNodeRoot(builtNodes);
    }

    /**
     * Builds a node tree from token list
     *
     * @abstract
     * @param {XmlToken[]} nextTokens The next tokens to be added
     * @returns {XmlPartialTree} The partial token tree
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    buildNodeTreeInternal(nextTokens) {
        throw new Error('Cannot call abstract method');
    }
}

export default XmlToken;
