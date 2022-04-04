import { BaseService } from "../BaseService.ts";
import { SortOrderLong } from "../../types.ts";
import { Base64Encode, Md5 } from "../../../deps.ts";
import * as JSONv2 from "../../utils/json.ts";

export interface ListDataStoresResponseDataStoresItem {
	name: string;
	createdDate: string;
}

export interface ListDataStoresResponse {
	datastores: ListDataStoresResponseDataStoresItem[];
	nextPageCursor?: string;
}

export interface EntryKey {
	scope: string;
	key: string;
}

export interface ListDataStoreEntriesResponse {
	keys: EntryKey[];
	nextPageCursor?: string;
}

export interface DataStoreEntry<
	Expect,
	Attributes extends Record<string, unknown>,
> {
	createdTime: string | null;
	versionCreatedTime: string | null;
	versionId: string | null;
	attributes: Attributes | null;
	userIds: number[] | null;
	value: Expect;
}

export interface EntryVersion {
	version?: string;
	deleted?: boolean;
	contentLength?: number;
	createdTime?: string;
	objectCreatedTime?: string;
}

export interface ListDataStoreEntryVersionsResponse {
	versions: EntryVersion[];
	nextPageCursor?: string;
}

export interface DataStoreEntryVersion<Expect> {
	createdTime: string | null;
	versionCreatedTime: string | null;
	versionId: string | null;
	value: Expect | null;
}

export class DataStoreService extends BaseService {
	static urls = {
		listDataStores: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores`,
		listDataStoreEntries: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries`,
		getDataStoreEntry: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
		updateDataStoreEntry: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
		incrementDataStoreEntry: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/increment`,
		removeDataStoreEntry: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
		listDataStoreEntryVersions: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions`,
		getDataStoreEntryVersion: (universeId: unknown) =>
			`{BEDEV2Url:datastores}/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions/version`,
	};

	public async listDataStores(
		universeId: number,
		prefix?: string,
		limit?: number,
		cursor?: string,
	): Promise<ListDataStoresResponse> {
		return (await this.rest.httpRequest<ListDataStoresResponse>({
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

	public async listDataStoreEntries(
		universeId: number,
		datastoreName: string,
		scopeOrAllScopes: string | boolean = "global",
		prefix?: string,
		limit?: number,
		cursor?: string,
	): Promise<ListDataStoreEntriesResponse> {
		return (await this.rest.httpRequest<ListDataStoreEntriesResponse>({
			url: DataStoreService.urls.listDataStoreEntries(universeId),
			query: {
				datastoreName,
				[typeof scopeOrAllScopes === "boolean" ? "AllScopes" : "scope"]:
					scopeOrAllScopes,
				prefix,
				limit,
				cursor,
			},
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async getDataStoreEntry<
		Expect = unknown,
		Attributes extends Record<string, unknown> = Record<string, unknown>,
	>(
		universeId: number,
		datastoreName: string,
		entryKey: string,
		scope = "global",
	): Promise<DataStoreEntry<Expect, Attributes>> {
		const response = await this.rest.httpRequest<Expect>({
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
			versionCreatedTime: response.headers.get(
				"last-modified",
			),
			versionId: response.headers.get("roblox-entry-version"),
			attributes: response.headers.has("roblox-entry-attributes")
				? JSON.parse(response.headers.get("roblox-entry-attributes")!)
				: null,
			userIds: response.headers.has("roblox-entry-userids")
				? JSON.parse(response.headers.get("roblox-entry-userids")!)
				: null,
			value: response.body,
		};
	}

	public async updateDataStoreEntry(
		universeId: number,
		dataStoreName: string,
		entryKey: string,
		data: string,
		attributes?: Record<string, unknown>,
		userIds?: number[],
		scope = "global",
		matchKeyVersion?: string,
		createOnly?: boolean,
	): Promise<EntryVersion> {
		return (await this.rest.httpRequest<EntryVersion>({
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
				"content-md5": Base64Encode(
					new Md5().update(data).digest(),
				),
			},
			body: {
				type: "text",
				value: data,
			},
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async incrementDataStoreEntry(
		universeId: number,
		dataStoreName: string,
		entryKey: string,
		incrementBy: number,
		attributes?: Record<string, unknown>,
		userIds?: number[],
		scope = "global",
	): Promise<EntryVersion> {
		return (await this.rest.httpRequest<EntryVersion>({
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

	public async removeDataStoreEntry(
		universeId: number,
		dataStoreName: string,
		entryKey: string,
		scope = "global",
	): Promise<void> {
		await this.rest.httpRequest<void>({
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

	public async listDataStoreEntryVersions(
		universeId: number,
		dataStoreName: string,
		entryKey: string,
		startTime?: string,
		endTime?: string,
		sortOrder?: SortOrderLong,
		limit?: number,
		scope = "global",
		cursor?: string,
	): Promise<ListDataStoreEntryVersionsResponse> {
		return (await this.rest.httpRequest<ListDataStoreEntryVersionsResponse>(
			{
				url: DataStoreService.urls.listDataStoreEntryVersions(
					universeId,
				),
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
			},
		)).body;
	}

	public async getDataStoreEntryVersion<Expect = unknown>(
		universeId: number,
		datastoreName: string,
		entryKey: string,
		versionId: string,
		scope = "global",
	): Promise<DataStoreEntryVersion<Expect>> {
		const response = await this.rest.httpRequest<string>({
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
			versionCreatedTime: response.headers.get(
				"last-modified",
			),
			versionId: response.headers.get("roblox-entry-version"),
			value:
				(response.body.length > 0
					? JSONv2.deserialize(response.body) as Expect
					: null),
		};
	}
}
