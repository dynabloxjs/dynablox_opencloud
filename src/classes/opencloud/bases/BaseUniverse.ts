import { BasePlace } from "./BasePlace.ts";
import { StandardDataStore } from "./../StandardDataStore.ts";
import { StandardDataStoreKeyInfo } from "../StandardDataStoreKeyInfo.ts";
import { ServicePage } from "../../../helpers/ServicePaging.ts";
import { type OpenCloudClient } from "../../../clients/OpenCloudClient.ts";

/**
 * Base Universe class for Open Cloud.
 */
export class BaseUniverse {
	/**
	 * The ID of the universe.
	 */
	public readonly id: number;

	/**
	 * The client to use services from.
	 * @private
	 */
	private readonly _client: OpenCloudClient;

	/**
	 * Construct a new BaseUniverse
	 * @param client The client to use services from.
	 * @param universeId - The universe id.
	 */
	constructor(client: OpenCloudClient, universeId: number) {
		this._client = client;
		this.id = universeId;
	}

	/**
	 * Get a sub base place within the universe.
	 * @param placeId - The place id to fetch.
	 */
	public getBasePlace(placeId: number): BasePlace {
		return new BasePlace(this._client, placeId, this.id);
	}

	/**
	 * Gets a standard DataStore by the name and scope.
	 * @param dataStoreName - The name of the data store.
	 * @param scope - The scope of the data store.
	 */
	public getStandardDataStore(
		dataStoreName: string,
		scope = "global",
	): StandardDataStore {
		return new StandardDataStore(
			this._client,
			this.id,
			dataStoreName,
			scope,
			"Standard",
		);
	}

	/**
	 * Lists Standard datastores by `prefix`.
	 * @param prefix - The prefix name.
	 * @param limit - The maximum allowed
	 * @param cursor - The cursor for a page.
	 */
	public listStandardDataStores(
		prefix?: string,
		limit?: number,
		cursor?: string,
	): ServicePage<
		OpenCloudClient["services"]["opencloud"]["DataStoreService"][
			"listDataStores"
		],
		StandardDataStoreKeyInfo[]
	> {
		this._client.canAccessResource(
			"universe-datastores.control",
			[this.id.toString()],
			"list",
			[false],
		);

		return new ServicePage<
			OpenCloudClient["services"]["opencloud"]["DataStoreService"][
				"listDataStores"
			],
			StandardDataStoreKeyInfo[]
		>(
			this._client.services.opencloud.DataStoreService,
			this._client.services.opencloud.DataStoreService
				.listDataStores,
			[
				this.id,
				prefix,
				limit,
				cursor,
			],
			(parameters, data) => {
				if (data) {
					if (!data.nextPageCursor) return;
					parameters[3] = data.nextPageCursor;

					return parameters;
				}
			},
			undefined,
			(data) => {
				return data.datastores.map((key) =>
					new StandardDataStoreKeyInfo(key.name, key.createdDate)
				);
			},
		);
	}
}
