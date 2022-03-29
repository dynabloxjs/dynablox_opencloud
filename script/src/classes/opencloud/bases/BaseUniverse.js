"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUniverse = void 0;
const BasePlace_js_1 = require("./BasePlace.js");
const StandardDataStore_js_1 = require("../StandardDataStore.js");
const StandardDataStoreKeyInfo_js_1 = require("../StandardDataStoreKeyInfo.js");
const ServicePaging_js_1 = require("../../../helpers/ServicePaging.js");
/**
 * Base Universe class for Open Cloud.
 */
class BaseUniverse {
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
        return new BasePlace_js_1.BasePlace(this._client, placeId, this.id);
    }
    /**
     * Gets a standard DataStore by the name and scope.
     * @param dataStoreName - The name of the data store.
     * @param scope - The scope of the data store.
     */
    getStandardDataStore(dataStoreName, scope = "global") {
        return new StandardDataStore_js_1.StandardDataStore(this._client, this.id, dataStoreName, scope, "Standard");
    }
    /**
     * Lists Standard datastores by `prefix`.
     * @param prefix - The prefix name.
     * @param limit - The maximum allowed
     * @param cursor - The cursor for a page.
     */
    listStandardDataStores(prefix, limit, cursor) {
        this._client.canAccessResource("universe-datastores.control", [this.id.toString()], "list", [false]);
        return new ServicePaging_js_1.ServicePage(this._client.services.opencloud.DataStoreService, this._client.services.opencloud.DataStoreService
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
            return data.datastores.map((key) => new StandardDataStoreKeyInfo_js_1.StandardDataStoreKeyInfo(key.name, key.createdDate));
        });
    }
}
exports.BaseUniverse = BaseUniverse;
