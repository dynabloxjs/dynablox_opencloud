"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreEntryVersion = void 0;
/**
 * DataStore key info.
 */
class DataStoreEntryVersion {
    /**
     * Create a new DataStore entry info.
     * @param data - The value of the entry.
     * @param versionId - The version key.
     * @param versionCreatedTime - The time the version was created at.
     * @param createdTime - The time the entry was first created at.
     */
    constructor(data, versionId, versionCreatedTime, createdTime) {
        /**
         * The value of the entry.
         */
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The version key.
         */
        Object.defineProperty(this, "versionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The time the version was created at.
         */
        Object.defineProperty(this, "versionCreatedTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The time the entry was first created at.
         */
        Object.defineProperty(this, "createdTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = data;
        this.versionId = versionId;
        this.versionCreatedTime = versionCreatedTime
            ? new Date(versionCreatedTime)
            : null;
        this.createdTime = createdTime ? new Date(createdTime) : null;
    }
}
exports.DataStoreEntryVersion = DataStoreEntryVersion;
