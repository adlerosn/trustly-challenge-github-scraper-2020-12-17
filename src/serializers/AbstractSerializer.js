export default class AbstractSerializer {
    /**
     * @abstract
     * @param {string} format The desired format
     * @returns {boolean} Whether this serializer fits such format
     */
    // eslint-disable-next-line no-unused-vars
    static matches(format) {
        return false;
    }

    /**
     * @abstract
     * @returns {string} The mimetype for this file format
     */
    static mimeType() {
        return 'text/plain';
    }

    /**
     * @abstract
     * @param {any} data The data to be serialized
     * @returns {string} The serialized string
     */
    // eslint-disable-next-line no-unused-vars
    static serialize(data) {
        throw new Error('Override this static method');
    }
}
