import AbstractSerializer from './AbstractSerializer.js';
import { escape as htmlEscape } from 'html-escaper';

export default class XmlSerializer extends AbstractSerializer {
    /** @override */
    static serialize(data) {
        return `<?xml version="1.0" encoding="UTF-8"?>\n${this.serializeInternal(data)}`;
    }

    static serializeInternal(data) {
        if (data === undefined) {
            return '<undefined />';
        }
        if (data === null) {
            return '<null />';
        }
        if (typeof (data) === 'string') {
            return `<string>${htmlEscape(data)}</string>`;
        }
        if (typeof (data) === 'number') {
            return `<number>${String(data)}</number>`;
        }
        if (Array.isArray(data)) {
            const array = data
                .map((item) => `<item>${this.serializeInternal(item)}</item>`)
                .join('');
            return `<array>${array}</array>`;
        }
        if (typeof (data) === 'object') {
            const obj = Object.entries(data)
                .map(([key, value]) => `<entry><key>${this.serializeInternal(key)}</key>`
                    + `<value>${this.serializeInternal(value)}</value></entry>`)
                .join('');
            return `<object>${obj}</object>`;
        }
        throw new Error(`Unknown data type: ${data}`);
    }

    static matches(format) {
        return ['xml'].includes(format.toLowerCase());
    }

    static mimeType() {
        return 'application/xml';
    }
}
