import XmlNodeElement from './XmlNodeElement.js';
import XmlPartialTree from './XmlPartialTree.js';
import XmlTokenTag from './XmlTokenTag.js';
import XmlTokenTagClosing from './XmlTokenTagClosing.js';

class XmlTokenTagOpening extends XmlTokenTag {
    toString() {
        return `<${this.tag}${this.getAttributesSerialized()} />`;
    }

    /**
     * @override
     * @param {XmlToken[]} nextTokens_ The next tokens to be added
     * @returns {XmlPartialTree} The partial token tree
     */
    buildNodeTreeInternal(nextTokens_) {
        const builtNodes = [];
        let currentToken;
        let nextTokens;
        [currentToken, ...nextTokens] = nextTokens_;
        while (
            currentToken !== undefined
            && !(
                (currentToken instanceof XmlTokenTagClosing)
                && currentToken.tag === this.tag
            )
        ) {
            const partialTree = currentToken.buildNodeTreeInternal(nextTokens);
            if (partialTree.xmlNode !== undefined) { // if could build a tree
                builtNodes.push(partialTree.xmlNode); // store the tree
                [currentToken, ...nextTokens] = partialTree.xmlTokens; // go to next token
            } else { // if couldn't build a tree
                [currentToken, ...nextTokens] = nextTokens; // ignore this problematic token and continue
            }
        }
        const hasTagClosedSuccessfully = (currentToken instanceof XmlTokenTagClosing)
            && currentToken.tag === this.tag;
        return hasTagClosedSuccessfully ? (
            new XmlPartialTree( // Wrap children and continue
                new XmlNodeElement(this.tag, this.attributes, builtNodes),
                nextTokens,
            )
        ) : (
            new XmlPartialTree( // Discard processed children and continue as if this was self-closing
                new XmlNodeElement(this.tag, this.attributes, []),
                nextTokens_,
            )
        );
    }
}

export default XmlTokenTagOpening;
