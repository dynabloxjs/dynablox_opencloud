"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardDataStoreKeyInfo = void 0;
/**
 * Standard DataStore info class for Open Cloud.
 */
class StandardDataStoreKeyInfo {
    /**
     * Construct a new StandardDataStoreKeyInfo.
     * @param name - The name of the datastore.
     * @param createdDate - Creation date of the datastore.
     */
    constructor(name, createdDate) {
        /**
         * The name of the datastore.
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Creation date of the datastore.
         */
        Object.defineProperty(this, "createdDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.createdDate = new Date(createdDate);
    }
}
exports.StandardDataStoreKeyInfo = StandardDataStoreKeyInfo;
