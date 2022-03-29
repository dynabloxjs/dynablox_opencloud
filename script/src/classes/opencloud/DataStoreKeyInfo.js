"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreKeyInfo = void 0;
/**
 * DataStore key info.
 */
class DataStoreKeyInfo {
    /**
     * Create a new DataStore entry version info.
     * @param scope - The scope of the key.
     * @param key - THe index of the key.
     */
    constructor(scope, key) {
        /**
         * The scope of the key.
         */
        Object.defineProperty(this, "scope", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * THe index of the key.
         */
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.scope = scope;
        this.key = key;
    }
}
exports.DataStoreKeyInfo = DataStoreKeyInfo;
