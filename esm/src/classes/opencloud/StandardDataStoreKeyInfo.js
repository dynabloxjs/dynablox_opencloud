/**
 * Standard DataStore info class for Open Cloud.
 */
export class StandardDataStoreKeyInfo {
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
