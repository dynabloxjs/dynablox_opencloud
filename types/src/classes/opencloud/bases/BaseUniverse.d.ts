import { BasePlace } from "./BasePlace.js";
import { StandardDataStore } from "../StandardDataStore.js";
import { StandardDataStoreKeyInfo } from "../StandardDataStoreKeyInfo.js";
import { ServicePage } from "../../../helpers/ServicePaging.js";
import { type OpenCloudClient } from "../../../clients/OpenCloudClient.js";
/**
 * Base Universe class for Open Cloud.
 */
export declare class BaseUniverse {
    /**
     * The ID of the universe.
     */
    readonly id: number;
    /**
     * The client to use services from.
     * @private
     */
    private readonly _client;
    /**
     * Construct a new BaseUniverse
     * @param client The client to use services from.
     * @param universeId - The universe id.
     */
    constructor(client: OpenCloudClient, universeId: number);
    /**
     * Get a sub base place within the universe.
     * @param placeId - The place id to fetch.
     */
    getBasePlace(placeId: number): BasePlace;
    /**
     * Gets a standard DataStore by the name and scope.
     * @param dataStoreName - The name of the data store.
     * @param scope - The scope of the data store.
     */
    getStandardDataStore(dataStoreName: string, scope?: string): StandardDataStore;
    /**
     * Lists Standard datastores by `prefix`.
     * @param prefix - The prefix name.
     * @param limit - The maximum allowed
     * @param cursor - The cursor for a page.
     */
    listStandardDataStores(prefix?: string, limit?: number, cursor?: string): ServicePage<OpenCloudClient["services"]["opencloud"]["DataStoreService"]["listDataStores"], StandardDataStoreKeyInfo[]>;
}
