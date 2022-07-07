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
exports.BaseUniverse = void 0;
const JSONv2 = __importStar(require("../../../utils/json.js"));
const BasePlace_js_1 = require("./BasePlace.js");
const StandardDataStore_js_1 = require("../StandardDataStore.js");
const StandardDataStoreKeyInfo_js_1 = require("../StandardDataStoreKeyInfo.js");
const ServicePaging_js_1 = require("../../../helpers/ServicePaging.js");
const OpenCloudClient_js_1 = require("../../../clients/OpenCloudClient.js");
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
     * Post a message to a MessagingService topicName.
     * @param topicName - The topic name to publish to.
     * @param data - The data to provide to the listeners.
     */
    postMessage(topicName, data) {
        this._client.canAccessResource("universe-messaging-service", [this.id.toString()], "publish", [false]);
        if (topicName.length > 50) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`topicName exceeds the maximum allowed 80 characters in length (${topicName.length})`);
        }
        const serializedDataLength = JSONv2.serialize(data).length;
        if (serializedDataLength > 1000) {
            throw new OpenCloudClient_js_1.OpenCloudClientError(`Serialized data exceeds the maximum allowed 1KB (${serializedDataLength})`);
        }
        return this._client.services.opencloud.MessagingService.publishTopicMessage(this.id, topicName, data);
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
