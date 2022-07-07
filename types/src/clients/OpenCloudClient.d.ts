import * as dntShim from "../../_dnt.shims.js";
import { BaseClient } from "./BaseClient.js";
import { BaseUniverse } from "../classes/opencloud/bases/BaseUniverse.js";
import { type RatelimitHelper } from "../helpers/RatelimitHelper.js";
import { type EnvironmentURLOptions } from "../types.js";
/**
 * Base options for the BaseClent.
 */
export interface OpenCloudClientOptionsBase {
    /**
     * Change the environment URLs. Default for `BEDEV2Url` is `apis.roblox.com/{0}`.
     */
    environmentURLOptions?: EnvironmentURLOptions;
    /**
     * The default headers to add to requests, values may be modified later on.
     */
    defaultHeaders?: Record<string, string> | dntShim.Headers;
    /**
     * Custom fetch implementation to use instead of the default `fetch`.
     */
    fetch?: (input: RequestInfo, init?: dntShim.RequestInit) => Promise<dntShim.Response>;
    /**
     * Aliases for strings in URLs. See more information in RESTController.ts
     */
    aliases?: Record<string, string>;
}
/**
 * OpenCloudClient options.
 */
export interface OpenCloudClientOptions {
    /**
     * The API Key credential value.
     */
    credentialsValue: string;
    /**
     * Allowed scopes to be used by the client.
     */
    scopes?: Scope[];
    /**
     * The ratelimiter helper function.
     */
    ratelimiter?: RatelimitHelper;
    /**
     * The subject ID for the ratelimiter.
     */
    ratelimiterSubjectId?: number;
    /**
     * Whether the ratelimiter should yield instead of throwing an error.
     */
    ratelimiterShouldYield?: boolean;
    /**
     * Retry timeout for 500, 502, and 504 responses in milliseconds.
     */
    requestRetryTimeout?: number;
    /**
     * Retry count for 500, 502, and 504 responses.
     */
    requestRetryCount?: number;
    /**
     * Base options.
     */
    base?: OpenCloudClientOptionsBase;
}
export interface UniversePlacesScope {
    scopeType: "universe-places";
    targetParts: [string];
    operations: "write"[];
    allowAllOperations?: boolean;
}
export interface UniverseDataStoresObjectsScope {
    scopeType: "universe-datastores.objects";
    targetParts: [string, string?];
    operations: ("read" | "create" | "update" | "delete" | "list")[];
    allowAllOperations?: boolean;
}
export interface UniverseDataStoresVersionsScope {
    scopeType: "universe-datastores.versions";
    targetParts: [string, string?];
    operations: ("read" | "list")[];
    allowAllOperations?: boolean;
}
export interface UniverseDataStoresControlScope {
    scopeType: "universe-datastores.control";
    targetParts: [string];
    operations: ("list" | "create")[];
    allowAllOperations?: boolean;
}
export interface UniverseMessagingServiceScope {
    scopeType: "universe-messaging-service";
    targetParts: [string];
    operations: ("publish")[];
    allowAllOperations?: boolean;
}
export declare type Scope = UniversePlacesScope | UniverseDataStoresObjectsScope | UniverseDataStoresVersionsScope | UniverseDataStoresControlScope | UniverseMessagingServiceScope;
/**
 * OpenCloudClient error objects.
 */
export declare class OpenCloudClientError extends Error {
    tryAgainIn?: Date;
    constructor(message: string, tryAgainIn?: Date);
}
/**
 * Open cloud client for open cloud.
 */
export declare class OpenCloudClient extends BaseClient {
    /**
     * The scopes allowed.
     * @private
     */
    private _scopes;
    get scopes(): Scope[];
    /**
     * The Ratelimit helper class.
     */
    readonly ratelimiter: RatelimitHelper;
    /**
     * The ID of the ratelimiter subject.
     */
    readonly ratelimiterSubjectId: number;
    /**
     * Retry timeout for 500, 502, and 504 responses in milliseconds.
     */
    readonly requestRetryTimeout: number;
    /**
     * Retry count for 500, 502, and 504 responses.
     */
    readonly requestRetryCount: number;
    /**
     * Whether the ratelimiter should yield instead of throwing an error.
     * @private
     */
    private readonly _ratelimiterShouldYield;
    /**
     * Errors if the API key can not access the resource.
     * @param scopeType - The scope type.
     * @param parts - The target parts.
     * @param operation - The operation.
     * @param partsOptional - The optional parts.
     */
    canAccessResource<ScopeType extends Scope["scopeType"]>(scopeType: ScopeType, parts: Extract<Scope, {
        scopeType: ScopeType;
    }>["targetParts"], operation: Extract<Scope, {
        scopeType: ScopeType;
    }>["operations"][number], partsOptional: boolean[]): void;
    /**
     * Set the allowed scopes.
     * @param scopes - The scopes to set.
     */
    setScopes(scopes: Scope[]): void;
    constructor(options: OpenCloudClientOptions);
    /**
     * Gets a base Universe by id.
     * @param universeId - The universe to fetch.
     */
    getBaseUniverse(universeId: number): BaseUniverse;
}
