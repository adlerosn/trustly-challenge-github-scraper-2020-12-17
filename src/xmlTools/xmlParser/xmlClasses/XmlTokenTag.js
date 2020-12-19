import { escapeHtml } from '../../escapers.js';
import XmlToken from './XmlToken.js';

/**
 * Represents a XML Token Tag
 *
 * @abstract
 */
class XmlTokenTag extends XmlToken {
    /**
     * Constructs a XML Token Tag
     *
     * @param {!string} tag The name of the tag (such as P, SPAN, but lowercase)
     * @param {!object} attributes The attributes defined for the tag
     */
    constructor(tag, attributes) {
        super();
        this.tag = tag.toLowerCase();
        this.attributes = attributes;
    }

    getAttributesSerialized() {
        return Object.entries(this.attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('');
    }
}

export default XmlTokenTag;
