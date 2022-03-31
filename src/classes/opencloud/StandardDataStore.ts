import * as JSONv2 from "../../utils/json.ts";
import { DataStoreEntry } from "./DataStoreEntry.ts";
import { DataStoreEntryVersionInfo } from "./DataStoreEntryVersionInfo.ts";
import { DataStoreEntryVersion } from "./DataStoreEntryVersion.ts";
import { DataStoreKeyInfo } from "./DataStoreKeyInfo.ts";
import { ServicePage } from "../../helpers/ServicePaging.ts";
import { SortOrderLong } from "../../types.ts";
import {
	type OpenCloudClient,
	OpenCloudClientError,
} from "../../clients/OpenCloudClient.ts";

/**
 * DataStore type.
 */
export enum DataStoreType {
	Standard = "Standard",
}

/**
 * Standard DataStore class for Open Cloud.
 */
export class StandardDataStore {
	/**
	 * The DataStore universe ID.
	 */
	public readonly universeId: number;
	/**
	 * The name of the datastore.
	 */
	public readonly name: string;

	/**
	 * The scope of the datastore.
	 */
	public readonly scope: string;

	/**
	 * The type of the DataStore.
	 */
	public readonly type: keyof typeof DataStoreType;

	/**
	 * The client to use services from.
	 * @private
	 */
	private readonly _client: OpenCloudClient;

	/**
	 * Construct a new BaseUniverse
	 * @param universeId - The DataStore universe ID.
	 * @param client The client to use services from.
	 * @param dataStoreName - The name of the datastore .
	 * @param scope - The scope of the datastore. Default is `global`.
	 * @param type - Type of the DataStore.
	 */
	constructor(
		client: OpenCloudClient,
		universeId: number,
		dataStoreName: string,
		scope: string,
		type: keyof typeof DataStoreType,
	) {
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
	public async getEntry<
		Data = unknown,
		Attributes extends Record<string, unknown> = Record<string, unknown>,
	>(key: string): Promise<DataStoreEntry<Data, Attributes>> {
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString()],
			"read",
			[false],
		);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}

		const response = await this._client.services.opencloud.DataStoreService
			.getDataStoreEntry<Data, Attributes>(
				this.universeId,
				this.name,
				key,
				this.scope,
			);

		return new DataStoreEntry<Data, Attributes>(
			response.value,
			response.userIds,
			response.attributes,
			response.versionId,
			response.versionCreatedTime,
			response.createdTime,
		);
	}

	/**
	 * Increment the value of an entry in a DataStore.
	 * @param key - The key of the entry to increment.
	 * @param incrementBy - The amount to increment the value by.
	 * @param userIds - An array of user IDs to be associated with the entry.
	 * @param attributes - The new attributes of the entry.
	 */
	public async incrementEntry(
		key: string,
		incrementBy: number,
		userIds?: number[],
		attributes?: Record<string, unknown>,
	): Promise<DataStoreEntryVersionInfo> {
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString()],
			"update",
			[false],
		);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}
		if (userIds && userIds.length > 4) {
			throw new OpenCloudClientError(
				`userIds exceeds the maximum allowed 4 items (${userIds.length})`,
			);
		}
		if (attributes && JSONv2.serialize(attributes).length > 300) {
			throw new OpenCloudClientError(
				`attributes exceeds the maximum allowed 300 characters in length (${key.length})`,
			);
		}

		const response = await this._client.services.opencloud.DataStoreService
			.incrementDataStoreEntry(
				this.universeId,
				this.name,
				key,
				incrementBy,
				attributes,
				userIds,
				this.scope,
			);

		return new DataStoreEntryVersionInfo(
			response.version,
			response.createdTime,
			response.objectCreatedTime,
			response.deleted,
			response.contentLength,
		);
	}

	/**
	 * Removes an entry from the DataStore.
	 * @param key - The key of the entry to remove.
	 */
	public async removeEntry(key: string): Promise<void> {
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString(), this.name],
			"delete",
			[false, true],
		);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}

		await this._client.services.opencloud.DataStoreService
			.removeDataStoreEntry(this.universeId, this.name, key, this.scope);
	}

	/**
	 * Get the content of a DataStore entry by version.
	 * @param key - The key of the entry to get.
	 * @param version - The version of the entry to get.
	 */
	public async getEntryVersion<Data = unknown>(
		key: string,
		version: string,
	): Promise<DataStoreEntryVersion<Data>> {
		this._client.canAccessResource(
			"universe-datastores.versions",
			[this.universeId.toString(), this.name],
			"read",
			[false, true],
		);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}

		const response = await this._client.services.opencloud.DataStoreService
			.getDataStoreEntryVersion<Data>(
				this.universeId,
				this.name,
				key,
				version,
				this.scope,
			);

		return new DataStoreEntryVersion<Data>(
			response.value,
			response.versionId,
			response.createdTime,
			response.versionCreatedTime,
		);
	}

	 /**
	 * Update the value of an entry in a DataStore.
	 * @param key - The key of the entry to update.
	 * @param data - The data to update the entry with.
	 * @param userIds - An array of user IDs to be associated with the entry.
	 * @param attributes - The new attributes of the entry.
	 */
	public async updateEntry(
		key: string,
		data: unknown,
		userIds?: number[],
		attributes?: Record<string, unknown>,
		matchKeyVersion?: string,
		createOnly?: boolean,
	): Promise<DataStoreEntryVersionInfo> {
		if (!createOnly) {
			this._client.canAccessResource(
				"universe-datastores.objects",
				[this.universeId.toString(), this.name],
				"update",
				[false, true],
			);
		}
		
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString(), this.name],
			"create",
			[false, true],
		);

		const serializedData = typeof data === "string"
			? data
			: JSONv2.serialize(data);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}
		if (serializedData.length > 4_000_000) {
			throw new OpenCloudClientError(
				`data exceeds the maximum allowed 4MB (${serializedData.length})`,
			);
		}
		if (userIds && userIds.length > 4) {
			throw new OpenCloudClientError(
				`userIds exceeds the maximum allowed 4 items (${userIds.length})`,
			);
		}
		if (attributes && JSONv2.serialize(attributes).length > 300) {
			throw new OpenCloudClientError(
				`attributes exceeds the maximum allowed 300 characters in length (${key.length})`,
			);
		}

		const response = await this._client.services.opencloud.DataStoreService
			.updateDataStoreEntry(
				this.universeId,
				this.name,
				key,
				typeof data === "string" ? data : JSONv2.serialize(data),
				attributes,
				userIds,
				this.scope,
				matchKeyVersion,
				createOnly,
			);

		return new DataStoreEntryVersionInfo(
			response.version,
			response.createdTime,
			response.objectCreatedTime,
			response.deleted,
			response.contentLength,
		);
	}

	/**
	 * List all DataStore entry versions.
	 * @param key - The key of the entry to list all versions for.
	 * @param limit - The limit of items per request.
	 * @param sortOrder - The sort order to get the data by.
	 * @param startTime - The start time of the query.
	 * @param endTime - The end time of the query.
	 * @param cursor - The cursor to request for the next batch of items.
	 */
	public listEntryVersions(
		key: string,
		limit?: number,
		sortOrder?: SortOrderLong,
		startTime?: string,
		endTime?: string,
		cursor?: string,
	): ServicePage<
		OpenCloudClient["services"]["opencloud"]["DataStoreService"][
			"listDataStoreEntryVersions"
		],
		DataStoreEntryVersionInfo[]
	> {
		this._client.canAccessResource(
			"universe-datastores.versions",
			[this.universeId.toString(), this.name],
			"list",
			[false, true],
		);

		if (key.length > 50) {
			throw new OpenCloudClientError(
				`key exceeds the maximum allowed 50 characters in length (${key.length})`,
			);
		}

		return new ServicePage<
			OpenCloudClient["services"]["opencloud"]["DataStoreService"][
				"listDataStoreEntryVersions"
			],
			DataStoreEntryVersionInfo[]
		>(
			this._client.services.opencloud.DataStoreService,
			this._client.services.opencloud.DataStoreService
				.listDataStoreEntryVersions,
			[
				this.universeId,
				this.name,
				key,
				startTime,
				endTime,
				sortOrder,
				limit,
				this.scope,
				cursor,
			],
			(parameters, data) => {
				if (data) {
					if (!data.nextPageCursor) return;
					parameters[8] = data.nextPageCursor;

					return parameters;
				}
			},
			undefined,
			(data) => {
				return data.versions.map((version) =>
					new DataStoreEntryVersionInfo(
						version.version,
						version.createdTime,
						version.objectCreatedTime,
						version.deleted,
						version.contentLength,
					)
				);
			},
		);
	}

	/**
	 * List all DataStore scope entries.
	 * @param prefix - The prefix for the entry keys to search for.
	 * @param limit - The limit of items per request.
	 * @param cursor - The cursor to request for the next batch of items.
	 */
	public listEntries(
		prefix?: string,
		limit?: number,
		cursor?: string,
	): ServicePage<
		OpenCloudClient["services"]["opencloud"]["DataStoreService"][
			"listDataStoreEntries"
		],
		DataStoreKeyInfo[]
	> {
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString(), this.name],
			"list",
			[false, true],
		);

		return new ServicePage<
			OpenCloudClient["services"]["opencloud"]["DataStoreService"][
				"listDataStoreEntries"
			],
			DataStoreKeyInfo[]
		>(
			this._client.services.opencloud.DataStoreService,
			this._client.services.opencloud.DataStoreService
				.listDataStoreEntries,
			[
				this.universeId,
				this.name,
				this.scope,
				prefix,
				limit,
				cursor,
			],
			(parameters, data) => {
				if (data) {
					if (!data.nextPageCursor) return;
					parameters[5] = data.nextPageCursor;

					return parameters;
				}
			},
			undefined,
			(data) => {
				return data.keys.map((key) =>
					new DataStoreKeyInfo(key.scope, key.key)
				);
			},
		);
	}

	/**
	 * List all DataStore entries.
	 * @param prefix - The prefix for the entry keys to search for.
	 * @param limit - The limit of items per request.
	 * @param cursor - The cursor to request for the next batch of items.
	 */
	public listAllEntries(
		prefix?: string,
		limit?: number,
		cursor?: string,
	): ServicePage<
		OpenCloudClient["services"]["opencloud"]["DataStoreService"][
			"listDataStoreEntries"
		],
		DataStoreKeyInfo[]
	> {
		this._client.canAccessResource(
			"universe-datastores.objects",
			[this.universeId.toString(), this.name],
			"list",
			[false, true],
		);

		return new ServicePage<
			OpenCloudClient["services"]["opencloud"]["DataStoreService"][
				"listDataStoreEntries"
			],
			DataStoreKeyInfo[]
		>(
			this._client.services.opencloud.DataStoreService,
			this._client.services.opencloud.DataStoreService
				.listDataStoreEntries,
			[
				this.universeId,
				this.name,
				true,
				prefix,
				limit,
				cursor,
			],
			(parameters, data) => {
				if (data) {
					if (!data.nextPageCursor) return;
					parameters[5] = data.nextPageCursor;

					return parameters;
				}
			},
			undefined,
			(data) => {
				return data.keys.map((key) =>
					new DataStoreKeyInfo(key.scope, key.key)
				);
			},
		);
	}
}
