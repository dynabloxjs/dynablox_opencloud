/**
 * DataStore key info.
 */
export declare class DataStoreKeyInfo {
    /**
     * The scope of the key.
     */
    readonly scope: string;
    /**
     * THe index of the key.
     */
    readonly key: string;
    /**
     * Create a new DataStore entry version info.
     * @param scope - The scope of the key.
     * @param key - THe index of the key.
     */
    constructor(scope: string, key: string);
}
