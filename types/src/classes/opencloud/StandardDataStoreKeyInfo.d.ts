/**
 * Standard DataStore info class for Open Cloud.
 */
export declare class StandardDataStoreKeyInfo {
    /**
     * The name of the datastore.
     */
    readonly name: string;
    /**
     * Creation date of the datastore.
     */
    readonly createdDate: Date;
    /**
     * Construct a new StandardDataStoreKeyInfo.
     * @param name - The name of the datastore.
     * @param createdDate - Creation date of the datastore.
     */
    constructor(name: string, createdDate: string);
}
