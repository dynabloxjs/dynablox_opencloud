"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreEntry = void 0;
/**
 * DataStore key info.
 */
class DataStoreEntry {
    /**
     * Create a new DataStore entry info.
     * @param data - The value of the entry.
     * @param userIds - Metadata UserIDs for the entry.
     * @param attributes - Metadata attributes for the entry.
     * @param versionId - The version key.
     * @param versionCreatedTime - The time the version was created at.
     * @param createdTime - The time the entry was first created at.
     */
    constructor(data, userIds, attributes, versionId, versionCreatedTime, createdTime) {
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
         * Metadata UserIDs for the entry.
         */
        Object.defineProperty(this, "userIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Metadata attributes for the entry.
         */
        Object.defineProperty(this, "attributes", {
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
        this.userIds = userIds;
        this.attributes = attributes;
        this.versionId = versionId;
        this.versionCreatedTime = versionCreatedTime
            ? new Date(versionCreatedTime)
            : null;
        this.createdTime = createdTime ? new Date(createdTime) : null;
    }
}
exports.DataStoreEntry = DataStoreEntry;
