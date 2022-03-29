import { DataStoreEntry } from "./DataStoreEntry.js";
import { DataStoreEntryVersionInfo } from "./DataStoreEntryVersionInfo.js";
import { DataStoreEntryVersion } from "./DataStoreEntryVersion.js";
import { DataStoreKeyInfo } from "./DataStoreKeyInfo.js";
import { ServicePage } from "../../helpers/ServicePaging.js";
import { SortOrderLong } from "../../types.js";
import { type OpenCloudClient } from "../../clients/OpenCloudClient.js";
/**
 * DataStore type.
 */
export declare enum DataStoreType {
    Standard = "Standard"
}
/**
 * Standard DataStore class for Open Cloud.
 */
export declare class StandardDataStore {
    /**
     * The DataStore universe ID.
     */
    readonly universeId: number;
    /**
     * The name of the datastore.
     */
    readonly name: string;
    /**
     * The scope of the datastore.
     */
    readonly scope: string;
    /**
     * The type of the DataStore.
     */
    readonly type: keyof typeof DataStoreType;
    /**
     * The client to use services from.
     * @private
     */
    private readonly _client;
    /**
     * Construct a new BaseUniverse
     * @param universeId - The DataStore universe ID.
     * @param client The client to use services from.
     * @param dataStoreName - The name of the datastore .
     * @param scope - The scope of the datastore. Default is `global`.
     * @param type - Type of the DataStore.
     */
    constructor(client: OpenCloudClient, universeId: number, dataStoreName: string, scope: string, type: keyof typeof DataStoreType);
    /**
     * Get the content of a DataStore entry.
     * @param key - The key of the entry.
     */
    getEntry<Data = unknown, Attributes extends Record<string, unknown> = Record<string, unknown>>(key: string): Promise<DataStoreEntry<Data, Attributes>>;
    /**
     * Increment the value of an entry in a DataStore.
     * @param key - The key of the entry to increment.
     * @param incrementBy - The amount to increment the value by.
     * @param userIds - An array of user IDs to be associated with the entry.
     * @param attributes - The new attributes of the entry.
     */
    incrementEntry(key: string, incrementBy: number, userIds?: number[], attributes?: Record<string, unknown>): Promise<DataStoreEntryVersionInfo>;
    /**
     * Removes an entry from the DataStore.
     * @param key - The key of the entry to remove.
     */
    removeEntry(key: string): Promise<void>;
    getEntryVersion<Data = unknown>(key: string, version: string): Promise<DataStoreEntryVersion<Data>>;
    updateEntry(key: string, data: unknown, userIds?: number[], attributes?: Record<string, unknown>, matchKeyVersion?: string, createOnly?: boolean): Promise<DataStoreEntryVersionInfo>;
    listEntryVersions(key: string, limit?: number, sortOrder?: SortOrderLong, startTime?: string, endTime?: string, cursor?: string): ServicePage<OpenCloudClient["services"]["opencloud"]["DataStoreService"]["listDataStoreEntryVersions"], DataStoreEntryVersionInfo[]>;
    listEntries(prefix?: string, allScopes?: boolean, limit?: number, cursor?: string): ServicePage<OpenCloudClient["services"]["opencloud"]["DataStoreService"]["listDataStoreEntries"], DataStoreKeyInfo[]>;
}
