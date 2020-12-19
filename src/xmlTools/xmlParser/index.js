import { unescapeHtml } from '../escapers.js';
import XmlTokenData from './xmlClasses/XmlTokenData.js';
import XmlTokenTag from './xmlClasses/XmlTokenTag.js';
import XmlTokenTagBuilder from './xmlClasses/XmlTokenTagBuilder.js';
import XmlTokenTagComment from './xmlClasses/XmlTokenTagComment.js';

/**
 * Tokenizes a string into XML Tokens
 *
 * @param {!string} markup The string that represents a XML document
 * @returns {XmlToken[]} The list of tokens that XML have.
 */
function tokenizeXml(markup) {
    const tagDataPairs = `>${markup}`.split('<').map((data) => data.split(/>(.*)/).slice(0, 2));
    // What just happened in this ugly hack:
    // 1st) "d<t>d<t>d" became ">d<t>d<t>d" just for avoiding a special case on 3rd step
    // 2nd) Splitting at '<', we transformed ">d<t>d<t>d" into [">d", "t>d", "t>d"]
    // 3rd) Splitting at '>' we finally get into Pair<Tag, Data>[],
    //          where the first token is empty "<>" and can be ignored.
    // Most likely it wouldn't work if there was inline JS.
    const xmlTokens = tagDataPairs.flatMap(([token, data]) => [
        (new XmlTokenTagBuilder(token)).build(),
        new XmlTokenData(unescapeHtml(data)),
    ]);
    return xmlTokens;
}

/**
 * Transforms a string to a XML Node tree
 *
 * @param {!string} markup The string that represents a XML document
 * @returns {!XmlNodeRoot} The XML root node
 */
function parseXmlNodeTree(markup) {
    const xmlTokens = tokenizeXml(markup)
        .filter((token) => !(token instanceof XmlTokenTagComment)) // No comments
        .filter((token) => !((token instanceof XmlTokenTag) && (token.tag.length === 0))) // No empty tags
        .filter((token) => !((token instanceof XmlTokenData) && (token.text.length === 0))); // No empty texts
    return xmlTokens[0].buildNodeTree(xmlTokens.slice(1));
}

export default parseXmlNodeTree;
