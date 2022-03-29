/**
 * DataStore key info.
 */
export declare class DataStoreEntryVersion<Data> {
    /**
     * The value of the entry.
     */
    readonly data: Data | null;
    /**
     * The version key.
     */
    readonly versionId: string | null;
    /**
     * The time the version was created at.
     */
    readonly versionCreatedTime: Date | null;
    /**
     * The time the entry was first created at.
     */
    readonly createdTime: Date | null;
    /**
     * Create a new DataStore entry info.
     * @param data - The value of the entry.
     * @param versionId - The version key.
     * @param versionCreatedTime - The time the version was created at.
     * @param createdTime - The time the entry was first created at.
     */
    constructor(data: Data | null, versionId: string | null, versionCreatedTime: string | null, createdTime: string | null);
}
