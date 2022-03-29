/**
 * DataStore kentr yversion info.
 */
export declare class DataStoreEntryVersionInfo {
    /**
     * The version id.
     */
    readonly id?: string;
    /**
     * The time the version was created at.
     */
    readonly createdTime?: Date;
    /**
     * The time the entry was first created at.
     */
    readonly entryCreatedTime?: Date;
    /**
     * Whether the version was deleted.
     */
    readonly deleted?: boolean;
    /**
     * The content length of the entry version.
     */
    readonly contentLength?: number;
    /**
     * Create a new DataStore entry version info.
     * @param id - The version id.
     * @param createdTime - The time the version was created at.
     * @param entryCreatedTime - The time the entry was first created at.
     * @param deleted - Whether the version was deleted.
     * @param contentLength - The content length of the entry version.
     */
    constructor(id?: string, createdTime?: string, entryCreatedTime?: string, deleted?: boolean, contentLength?: number);
}
