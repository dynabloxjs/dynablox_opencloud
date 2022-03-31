"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardDataStore = exports.DataStoreType = void 0;
const JSONv2 = __importStar(require("../../utils/json.js"));
const DataStoreEntry_js_1 = require("./DataStoreEntry.js");
const DataStoreEntryVersionInfo_js_1 = require("./DataStoreEntryVersionInfo.js");
const DataStoreEntryVersion_js_1 = require("./DataStoreEntryVersion.js");
const DataStoreKeyInfo_js_1 = require("./DataStoreKeyInfo.js");
const ServicePaging_js_1 = require("../../helpers/ServicePaging.js");
const OpenCloudClient_js_1 = require("../../clients/OpenCloudClient.js");
/**
 * DataStore type.
 */
var DataStoreType;
(function (DataStoreType) {
    DataStoreType["Standard"] = "Standard";
})(DataStoreType = exports.DataStoreType || (exports.DataStoreType = {}));
/**
 * Standard DataStore class for Open Cloud.
 */
class StandardDataStore {
    /**
     * Construct a new BaseUniverse
     * @param universeId - The DataStore universe ID.
     * @param client The client to use services from.
     * @param dataStoreName - The name of the datastore .
     * @param scope - The scope of the datastore. Default is `global`.
     * @param type - Type of the DataStore.
     */
    constructor(client, universeId, dataStoreName, scope, type) {
        /**
         * The DataStore universe ID.
         */
        Object.defineProperty(this, "universeId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
         * The scope of the datastore.
         */
        Object.defineProperty(this, "scope", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The type of the DataStore.
         */
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The client to use services from.
         * @private
         */
        Object.defineProperty(this, "_client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.universeId = universeId;
        this._client = client;
        this.name = dataStoreName;
        this.scope = scope;
        this.type = type;
    }
    /**
     * Get the content of a DataStore entry.
     * @param key - The key of the entry.
     */
    async getEntry(key) {
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString()], "read", [false]);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        const response = await this._client.services.opencloud.DataStoreService
            .getDataStoreEntry(this.universeId, this.name, key, this.scope);
        return new DataStoreEntry_js_1.DataStoreEntry(response.value, response.userIds, response.attributes, response.versionId, response.versionCreatedTime, response.createdTime);
    }
    /**
     * Increment the value of an entry in a DataStore.
     * @param key - The key of the entry to increment.
     * @param incrementBy - The amount to increment the value by.
     * @param userIds - An array of user IDs to be associated with the entry.
     * @param attributes - The new attributes of the entry.
     */
    async incrementEntry(key, incrementBy, userIds, attributes) {
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString()], "update", [false]);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        if (userIds && userIds.length > 4) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`userIds exceeds the maximum allowed 4 items (${userIds.length})`);
        }
        if (attributes && JSONv2.serialize(attributes).length > 300) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`attributes exceeds the maximum allowed 300 characters in length (${key.length})`);
        }
        const response = await this._client.services.opencloud.DataStoreService
            .incrementDataStoreEntry(this.universeId, this.name, key, incrementBy, attributes, userIds, this.scope);
        return new DataStoreEntryVersionInfo_js_1.DataStoreEntryVersionInfo(response.version, response.createdTime, response.objectCreatedTime, response.deleted, response.contentLength);
    }
    /**
     * Removes an entry from the DataStore.
     * @param key - The key of the entry to remove.
     */
    async removeEntry(key) {
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString(), this.name], "delete", [false, true]);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        await this._client.services.opencloud.DataStoreService
            .removeDataStoreEntry(this.universeId, this.name, key, this.scope);
    }
    /**
     * Get the content of a DataStore entry by version.
     * @param key - The key of the entry to get.
     * @param version - The version of the entry to get.
     */
    async getEntryVersion(key, version) {
        this._client.canAccessResource("universe-datastores.versions", [this.universeId.toString(), this.name], "read", [false, true]);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        const response = await this._client.services.opencloud.DataStoreService
            .getDataStoreEntryVersion(this.universeId, this.name, key, version, this.scope);
        return new DataStoreEntryVersion_js_1.DataStoreEntryVersion(response.value, response.versionId, response.createdTime, response.versionCreatedTime);
    }
    async updateEntry(key, data, userIds, attributes, matchKeyVersion, createOnly) {
        if (!createOnly) {
            this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString(), this.name], "update", [false, true]);
        }
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString(), this.name], "create", [false, true]);
        const serializedData = typeof data === "string"
            ? data
            : JSONv2.serialize(data);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        if (serializedData.length > 4000000) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`data exceeds the maximum allowed 4MB (${serializedData.length})`);
        }
        if (userIds && userIds.length > 4) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`userIds exceeds the maximum allowed 4 items (${userIds.length})`);
        }
        if (attributes && JSONv2.serialize(attributes).length > 300) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`attributes exceeds the maximum allowed 300 characters in length (${key.length})`);
        }
        const response = await this._client.services.opencloud.DataStoreService
            .updateDataStoreEntry(this.universeId, this.name, key, typeof data === "string" ? data : JSONv2.serialize(data), attributes, userIds, this.scope, matchKeyVersion, createOnly);
        return new DataStoreEntryVersionInfo_js_1.DataStoreEntryVersionInfo(response.version, response.createdTime, response.objectCreatedTime, response.deleted, response.contentLength);
    }
    listEntryVersions(key, limit, sortOrder, startTime, endTime, cursor) {
        this._client.canAccessResource("universe-datastores.versions", [this.universeId.toString(), this.name], "list", [false, true]);
        if (key.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`key exceeds the maximum allowed 50 characters in length (${key.length})`);
        }
        return new ServicePaging_js_1.ServicePage(this._client.services.opencloud.DataStoreService, this._client.services.opencloud.DataStoreService
            .listDataStoreEntryVersions, [
            this.universeId,
            this.name,
            key,
            startTime,
            endTime,
            sortOrder,
            limit,
            this.scope,
            cursor,
        ], (parameters, data) => {
            if (data) {
                if (!data.nextPageCursor)
                    return;
                parameters[8] = data.nextPageCursor;
                return parameters;
            }
        }, undefined, (data) => {
            return data.versions.map((version) => new DataStoreEntryVersionInfo_js_1.DataStoreEntryVersionInfo(version.version, version.createdTime, version.objectCreatedTime, version.deleted, version.contentLength));
        });
    }
    listEntries(prefix, limit, cursor) {
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString(), this.name], "list", [false, true]);
        return new ServicePaging_js_1.ServicePage(this._client.services.opencloud.DataStoreService, this._client.services.opencloud.DataStoreService
            .listDataStoreEntries, [
            this.universeId,
            this.name,
            this.scope,
            prefix,
            limit,
            cursor,
        ], (parameters, data) => {
            if (data) {
                if (!data.nextPageCursor)
                    return;
                parameters[5] = data.nextPageCursor;
                return parameters;
            }
        }, undefined, (data) => {
            return data.keys.map((key) => new DataStoreKeyInfo_js_1.DataStoreKeyInfo(key.scope, key.key));
        });
    }
    listAllEntries(prefix, limit, cursor) {
        this._client.canAccessResource("universe-datastores.objects", [this.universeId.toString(), this.name], "list", [false, true]);
        return new ServicePaging_js_1.ServicePage(this._client.services.opencloud.DataStoreService, this._client.services.opencloud.DataStoreService
            .listDataStoreEntries, [
            this.universeId,
            this.name,
            true,
            prefix,
            limit,
            cursor,
        ], (parameters, data) => {
            if (data) {
                if (!data.nextPageCursor)
                    return;
                parameters[5] = data.nextPageCursor;
                return parameters;
            }
        }, undefined, (data) => {
            return data.keys.map((key) => new DataStoreKeyInfo_js_1.DataStoreKeyInfo(key.scope, key.key));
        });
    }
}
exports.StandardDataStore = StandardDataStore;
