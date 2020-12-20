import AbstractCache from './AbstractCache.js';

export default class InMemoryCache extends AbstractCache {
    constructor(maxItems) {
        super(maxItems);
        /** @type {string[]} */
        this.storedKeys = [];
        this.itemStore = {};
    }

    getKey(key) {
        return this.itemStore[key];
    }

    putKey(key, value) {
        const isReplacing = this.storedKeys.includes(key);
        if (!isReplacing) {
            this.storedKeys.push(key);
        }
        this.itemStore[key] = value;
        if (!isReplacing) {
            this.enforceMaxItems();
        } else {
            this.repristinateKey(key);
        }
        return value;
    }

    repristinateKey(key) {
        if (this.storedKeys.includes(key)) {
            this.storedKeys = this.storedKeys.filter(
                (storedKey) => key !== storedKey,
            );
            this.storedKeys.push(key);
        }
    }

    removeKey(key) {
        if (this.storedKeys.includes(key)) {
            this.storedKeys = this.storedKeys.filter(
                (storedKey) => key !== storedKey,
            );
            delete this.itemStore[key];
        }
    }

    enforceMaxItems() {
        while (this.storedKeys.length > this.maxItems) {
            const key = this.storedKeys.shift();
            delete this.itemStore[key];
        }
    }
}
