/**
 * @abstract
 */
export default class AbstractCache {
    /**
     * Constructs a cache
     *
     * @param {number} maxItems The maximum items the cache supports
     */
    constructor(maxItems) {
        this.maxItems = Math.max(0, Number(maxItems) || 0);
    }

    /**
     * Retrieves an entry from the cache
     *
     * @abstract
     * @param {!string} key The key to retrieve
     * @returns {any?} The previously stored data
     */
    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    getKey(key) {
        return undefined;
    }

    /**
     * Stores an entry into cache
     *
     * @abstract
     * @param {!string} key The key to store
     * @param {any} value The data to store
     */
    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    putKey(key, value) { }

    /**
     * Marks key for not expiring as early as before
     *
     * https://www.merriam-webster.com/dictionary/repristinate
     *
     * @abstract
     * @param {!string} key The key to repristine
     */
    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    repristinateKey(key) { }

    /**
     * Expires a key right now
     *
     * @abstract
     * @param {!string} key The key to remove
     */
    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    removeKey(key) { }
}
