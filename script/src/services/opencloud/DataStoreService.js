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
exports.DataStoreService = void 0;
const BaseService_js_1 = require("../BaseService.js");
const deps_js_1 = require("../../../deps.js");
const JSONv2 = __importStar(require("../../utils/json.js"));
class DataStoreService extends BaseService_js_1.BaseService {
    async listDataStores(universeId, prefix, limit, cursor) {
        return (await this.rest.httpRequest({
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores`,
            query: {
                cursor,
                limit,
                prefix,
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async listDataStoreEntries(universeId, datastoreName, scope = "global", allScopes, prefix, limit, cursor) {
        return (await this.rest.httpRequest({
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries`,
            query: {
                datastoreName,
                scope,
                AllScopes: allScopes,
                prefix,
                limit,
                cursor,
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async getDataStoreEntry(universeId, datastoreName, entryKey, scope = "global") {
        const response = await this.rest.httpRequest({
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
            query: {
                datastoreName,
                entryKey,
                scope,
            },
            camelizeResponse: false,
            errorHandling: "BEDEV2",
            includeCredentials: true,
        });
        return {
            createdTime: response.headers.get("roblox-entry-created-time"),
            versionCreatedTime: response.headers.get("last-modified"),
            versionId: response.headers.get("roblox-entry-version"),
            attributes: response.headers.has("roblox-entry-attributes")
                ? JSON.parse(response.headers.get("roblox-entry-attributes"))
                : null,
            userIds: response.headers.has("roblox-entry-userids")
                ? JSON.parse(response.headers.get("roblox-entry-userids"))
                : null,
            value: response.body,
        };
    }
    async updateDataStoreEntry(universeId, dataStoreName, entryKey, data, attributes, userIds, scope = "global", matchKeyVersion, createOnly) {
        return (await this.rest.httpRequest({
            method: "POST",
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
            query: {
                dataStoreName,
                entryKey,
                scope,
                matchKeyVersion,
                exclusiveCreate: createOnly,
            },
            headers: {
                "roblox-entry-userids": JSON.stringify(userIds),
                "roblox-entry-attributes": JSON.stringify(attributes),
                "content-md5": (0, deps_js_1.Base64Encode)(new deps_js_1.Md5().update(data).digest()),
            },
            body: {
                type: "text",
                value: data,
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async incrementDataStoreEntry(universeId, dataStoreName, entryKey, incrementBy, attributes, userIds, scope = "global") {
        return (await this.rest.httpRequest({
            method: "POST",
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/increment`,
            query: {
                dataStoreName,
                entryKey,
                scope,
                incrementBy,
            },
            headers: {
                "roblox-entry-userids": JSON.stringify(userIds),
                "roblox-entry-attributes": JSON.stringify(attributes),
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async removeDataStoreEntry(universeId, dataStoreName, entryKey, scope = "global") {
        await this.rest.httpRequest({
            method: "DELETE",
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
            query: {
                dataStoreName,
                entryKey,
                scope,
            },
            expect: "none",
            errorHandling: "BEDEV2",
            includeCredentials: true,
        });
    }
    async listDataStoreEntryVersions(universeId, dataStoreName, entryKey, startTime, endTime, sortOrder, limit, scope = "global", cursor) {
        return (await this.rest.httpRequest({
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions`,
            query: {
                dataStoreName,
                entryKey,
                scope,
                startTime,
                endTime,
                sortOrder,
                limit,
                cursor,
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async getDataStoreEntryVersion(universeId, datastoreName, entryKey, versionId, scope = "global") {
        const response = await this.rest.httpRequest({
            url: `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions/version`,
            query: {
                datastoreName,
                entryKey,
                versionId,
                scope,
            },
            expect: "text",
            errorHandling: "BEDEV2",
            includeCredentials: true,
        });
        return {
            createdTime: response.headers.get("roblox-entry-created-time"),
            versionCreatedTime: response.headers.get("last-modified"),
            versionId: response.headers.get("roblox-entry-version"),
            value: (response.body.length > 0
                ? JSONv2.deserialize(response.body)
                : null),
        };
    }
}
exports.DataStoreService = DataStoreService;
