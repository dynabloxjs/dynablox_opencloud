import { BaseService } from "../BaseService.js";
import { Base64Encode, Md5 } from "../../../deps.js";
import * as JSONv2 from "../../utils/json.js";
export class DataStoreService extends BaseService {
    async listDataStores(universeId, prefix, limit, cursor) {
        return (await this.rest.httpRequest({
            url: DataStoreService.urls.listDataStores(universeId),
            query: {
                cursor,
                limit,
                prefix,
            },
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
    async listDataStoreEntries(universeId, datastoreName, scopeOrAllScopes = "global", prefix, limit, cursor) {
        return (await this.rest.httpRequest({
            url: DataStoreService.urls.listDataStoreEntries(universeId),
            query: {
                datastoreName,
                [typeof scopeOrAllScopes === "boolean" ? "AllScopes" : "scope"]: scopeOrAllScopes,
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
            url: DataStoreService.urls.getDataStoreEntry(universeId),
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
            url: DataStoreService.urls.updateDataStoreEntry(universeId),
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
                "content-md5": Base64Encode(new Md5().update(data).digest()),
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
            url: DataStoreService.urls.incrementDataStoreEntry(universeId),
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
            url: DataStoreService.urls.removeDataStoreEntry(universeId),
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
            url: DataStoreService.urls.listDataStoreEntryVersions(universeId),
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
            url: DataStoreService.urls.getDataStoreEntryVersion(universeId),
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
Object.defineProperty(DataStoreService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        listDataStores: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores`,
        listDataStoreEntries: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries`,
        getDataStoreEntry: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
        updateDataStoreEntry: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
        incrementDataStoreEntry: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/increment`,
        removeDataStoreEntry: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
        listDataStoreEntryVersions: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions`,
        getDataStoreEntryVersion: (universeId) => `{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions/version`,
    }
});
