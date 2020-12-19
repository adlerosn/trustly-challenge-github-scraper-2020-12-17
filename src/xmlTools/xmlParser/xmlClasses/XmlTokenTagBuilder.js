import { unescapeHtml } from '../../escapers.js';
import { ValueError } from '../../../exceptions/index.js';
import XmlTokenTagClosing from './XmlTokenTagClosing.js';
import XmlTokenTagComment from './XmlTokenTagComment.js';
import XmlTokenTagOpening from './XmlTokenTagOpening.js';
import XmlTokenTagSelfClosing from './XmlTokenTagSelfClosing.js';

/**
 * Builds a specific XML Token Tag concrete subclass from string.
 */
class XmlTokenTagBuilder {
    /**
     * Initializes the builder for XML Tag Token
     *
     * @param {string} serializedData_ The serialized data to be transformed into an object
     * @throws {ValueError}
     */
    constructor(serializedData_) {
        let serializedData = serializedData_;
        this.isComment = false;
        this.isOpening = false;
        this.isClosing = false;
        this.isUnary = false;
        this.tag = '';
        this.attrs = {};
        if (serializedData.startsWith('!')) {
            this.isComment = true;
            serializedData = serializedData.substring(1);
        } else if (serializedData.startsWith('?')) {
            this.isComment = true;
            serializedData = serializedData.substr(1, serializedData.length - 2);
        } else if (serializedData.startsWith('/')) {
            this.isClosing = true;
            serializedData = serializedData.substr(1);
        } else if (serializedData.endsWith('/')) {
            this.isUnary = true;
            serializedData = serializedData.substr(0, serializedData.length - 1);
        } else {
            this.isOpening = true;
        }
        serializedData = serializedData.trim();
        if (!this.isComment) {
            if (!serializedData.includes(' ')) {
                // Tag with no attributes
                this.tag = serializedData;
            } else {
                // Tag with attributes
                let attrsSerialized;
                [this.tag, attrsSerialized] = serializedData.trim().split(/(.*?) (.*)/).slice(1, 3);
                while (attrsSerialized.length > 0) { // While there are attributes to be processed
                    let attrKey;
                    [attrKey, attrsSerialized] = attrsSerialized.trim().split(/([^= ]*)(.*)/).slice(1, 3);
                    // split at ' ' or '='
                    if (attrsSerialized === '' || attrsSerialized.startsWith(' ')) {
                        // When found script's async and defer
                        this.attrs[attrKey] = attrKey;
                        attrsSerialized = attrsSerialized.trim();
                    } else if (attrsSerialized.startsWith('="')) {
                        // When found something like `rel="me"` (double quotes)
                        let attrVal;
                        [attrVal, attrsSerialized] = attrsSerialized.substr(2).split(/([^"]*)(.*)/).slice(1, 3);
                        attrsSerialized = attrsSerialized.substr(1).trim();
                        this.attrs[attrKey] = attrVal;
                    } else if (attrsSerialized.startsWith('=\'')) {
                        // When found something like `rel='me'` (single quotes)
                        let attrVal;
                        [attrVal, attrsSerialized] = attrsSerialized.substr(2).split(/([^']*)(.*)/).slice(1, 3);
                        attrsSerialized = attrsSerialized.substr(1).trim();
                        this.attrs[attrKey] = attrVal;
                    } else if (attrsSerialized.startsWith('=')) {
                        // When found something like `rel=me` (no quotes) [invalid syntax, but let's pretend it isn't]
                        let attrVal;
                        [attrVal, attrsSerialized] = attrsSerialized.substr(1).split(/([^ ]*)(.*)/).slice(1, 3);
                        attrsSerialized = attrsSerialized.trim();
                        this.attrs[attrKey] = attrVal;
                    } else {
                        throw new ValueError(`Unexpected token while parsing XML: ${attrsSerialized.substr(0, 30)}...`);
                    }
                }
            }
        }
    }

    /**
     * @returns {XmlTokenTag} The parsed XML Token Tag
     */
    build() {
        const escapedAttrs = Object.fromEntries(
            Object.entries(this.attrs)
                .map(([key, value]) => [key, unescapeHtml(value)]),
        );
        if (this.isOpening) return new XmlTokenTagOpening(this.tag.toLowerCase(), escapedAttrs);
        if (this.isUnary) return new XmlTokenTagSelfClosing(this.tag.toLowerCase(), escapedAttrs);
        if (this.isClosing) return new XmlTokenTagClosing(this.tag.toLowerCase(), escapedAttrs);
        if (this.isComment) return new XmlTokenTagComment(this.tag, {});
        throw new ValueError('XmlTokenTagBuilder has been tampered.');
    }
}

export default XmlTokenTagBuilder;
