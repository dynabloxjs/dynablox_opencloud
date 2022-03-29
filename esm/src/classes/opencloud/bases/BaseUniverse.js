import { BasePlace } from "./BasePlace.js";
import { StandardDataStore } from "../StandardDataStore.js";
import { StandardDataStoreKeyInfo } from "../StandardDataStoreKeyInfo.js";
import { ServicePage } from "../../../helpers/ServicePaging.js";
/**
 * Base Universe class for Open Cloud.
 */
export class BaseUniverse {
    /**
     * Construct a new BaseUniverse
     * @param client The client to use services from.
     * @param universeId - The universe id.
     */
    constructor(client, universeId) {
        /**
         * The ID of the universe.
         */
        Object.defineProperty(this, "id", {
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
        this._client = client;
        this.id = universeId;
    }
    /**
     * Get a sub base place within the universe.
     * @param placeId - The place id to fetch.
     */
    getBasePlace(placeId) {
        return new BasePlace(this._client, placeId, this.id);
    }
    /**
     * Gets a standard DataStore by the name and scope.
     * @param dataStoreName - The name of the data store.
     * @param scope - The scope of the data store.
     */
    getStandardDataStore(dataStoreName, scope = "global") {
        return new StandardDataStore(this._client, this.id, dataStoreName, scope, "Standard");
    }
    /**
     * Lists Standard datastores by `prefix`.
     * @param prefix - The prefix name.
     * @param limit - The maximum allowed
     * @param cursor - The cursor for a page.
     */
    listStandardDataStores(prefix, limit, cursor) {
        this._client.canAccessResource("universe-datastores.control", [this.id.toString()], "list", [false]);
        return new ServicePage(this._client.services.opencloud.DataStoreService, this._client.services.opencloud.DataStoreService
            .listDataStores, [
            this.id,
            prefix,
            limit,
            cursor,
        ], (parameters, data) => {
            if (data) {
                if (!data.nextPageCursor)
                    return;
                parameters[3] = data.nextPageCursor;
                return parameters;
            }
        }, undefined, (data) => {
            return data.datastores.map((key) => new StandardDataStoreKeyInfo(key.name, key.createdDate));
        });
    }
}
