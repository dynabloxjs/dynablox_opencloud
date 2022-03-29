"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreEntryVersionInfo = void 0;
/**
 * DataStore kentr yversion info.
 */
class DataStoreEntryVersionInfo {
    /**
     * Create a new DataStore entry version info.
     * @param id - The version id.
     * @param createdTime - The time the version was created at.
     * @param entryCreatedTime - The time the entry was first created at.
     * @param deleted - Whether the version was deleted.
     * @param contentLength - The content length of the entry version.
     */
    constructor(id, createdTime, entryCreatedTime, deleted, contentLength) {
        /**
         * The version id.
         */
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The time the version was created at.
         */
        Object.defineProperty(this, "createdTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The time the entry was first created at.
         */
        Object.defineProperty(this, "entryCreatedTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Whether the version was deleted.
         */
        Object.defineProperty(this, "deleted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The content length of the entry version.
         */
        Object.defineProperty(this, "contentLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = id;
        this.createdTime = createdTime ? new Date(createdTime) : undefined;
        this.entryCreatedTime = entryCreatedTime
            ? new Date(entryCreatedTime)
            : undefined;
        this.deleted = deleted;
        this.contentLength = contentLength;
    }
}
exports.DataStoreEntryVersionInfo = DataStoreEntryVersionInfo;
