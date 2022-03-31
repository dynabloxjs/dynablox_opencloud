import { BaseService } from "../BaseService.js";
import { SortOrderLong } from "../../types.js";
export interface ListDataStoresResponseDataStoresItem {
    name: string;
    createdDate: string;
}
export interface ListDataStoresResponse {
    datastores: ListDataStoresResponseDataStoresItem[];
    nextPageCursor: string | null;
}
export interface EntryKey {
    scope: string;
    key: string;
}
export interface ListDataStoreEntriesResponse {
    keys: EntryKey[];
    nextPageCursor: string | null;
}
export interface DataStoreEntry<Expect, Attributes extends Record<string, unknown>> {
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
    nextPageCursor: string | null;
}
export interface DataStoreEntryVersion<Expect> {
    createdTime: string | null;
    versionCreatedTime: string | null;
    versionId: string | null;
    value: Expect | null;
}
export declare class DataStoreService extends BaseService {
    listDataStores(universeId: number, prefix?: string, limit?: number, cursor?: string): Promise<ListDataStoresResponse>;
    listDataStoreEntries(universeId: number, datastoreName: string, scope?: string, allScopes?: boolean, prefix?: string, limit?: number, cursor?: string): Promise<ListDataStoreEntriesResponse>;
    getDataStoreEntry<Expect = unknown, Attributes extends Record<string, unknown> = Record<string, unknown>>(universeId: number, datastoreName: string, entryKey: string, scope?: string): Promise<DataStoreEntry<Expect, Attributes>>;
    updateDataStoreEntry(universeId: number, dataStoreName: string, entryKey: string, data: string, attributes?: Record<string, unknown>, userIds?: number[], scope?: string, matchKeyVersion?: string, createOnly?: boolean): Promise<EntryVersion>;
    incrementDataStoreEntry(universeId: number, dataStoreName: string, entryKey: string, incrementBy: number, attributes?: Record<string, unknown>, userIds?: number[], scope?: string): Promise<EntryVersion>;
    removeDataStoreEntry(universeId: number, dataStoreName: string, entryKey: string, scope?: string): Promise<void>;
    listDataStoreEntryVersions(universeId: number, dataStoreName: string, entryKey: string, startTime?: string, endTime?: string, sortOrder?: SortOrderLong, limit?: number, scope?: string, cursor?: string): Promise<ListDataStoreEntryVersionsResponse>;
    getDataStoreEntryVersion<Expect = unknown>(universeId: number, datastoreName: string, entryKey: string, versionId: string, scope?: string): Promise<DataStoreEntryVersion<Expect>>;
}
