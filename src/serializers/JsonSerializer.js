import AbstractSerializer from './AbstractSerializer.js';

export default class JsonSerializer extends AbstractSerializer {
    /** @override */
    static serialize(data) {
        return JSON.stringify(data, {}, 4);
    }

    static matches(format) {
        return ['json'].includes(format.toLowerCase());
    }

    static mimeType() {
        return 'application/json';
    }
}
