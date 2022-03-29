import * as dntShim from "../../_dnt.shims.js";
import { BaseClient } from "./BaseClient.js";
import { BaseUniverse } from "../classes/opencloud/bases/BaseUniverse.js";
import { getOpenCloudRatelimitHelper } from "../utils/getOpenCloudRatelimitHelper.js";
/**
 * OpenCloudClient error objects.
 */
export class OpenCloudClientError extends Error {
    constructor(message, tryAgainIn) {
        super(message);
        Object.defineProperty(this, "tryAgainIn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tryAgainIn = tryAgainIn;
    }
}
/**
 * Open cloud client for open cloud.
 */
export class OpenCloudClient extends BaseClient {
    constructor(options) {
        const fetchFunction = (input, init) => {
            const url = new URL(typeof input === "string" ? input : input.url);
            const method = (init?.method ?? "GET");
            if (!this.ratelimiter.getRequestAvailability(method, url, this.ratelimiterSubjectId)) {
                const nextRequestTime = this.ratelimiter
                    .getNextRequestAvailability(method, url, this.ratelimiterSubjectId);
                if (nextRequestTime && this._ratelimiterShouldYield) {
                    return new Promise((resolve) => dntShim.setTimeout(() => resolve(fetchFunction(input, init)), nextRequestTime.getTime() - Date.now()));
                }
                throw new OpenCloudClientError(`${method} "${url.toString()}" reached the maximum amount of requests for the time period. Try again on ${nextRequestTime?.toLocaleString() ?? "never"}.`, nextRequestTime);
            }
            // @ts-ignore: Ignore this in DNT please.
            return (options.base?.fetch ?? dntShim.fetch)(input, init).then((response) => {
                if (response.ok || response.status === 429) {
                    this.ratelimiter.incrementRatelimits(method, url, this.ratelimiterSubjectId);
                }
                return response;
            });
        };
        super({
            ...options?.base,
            fetch: fetchFunction,
            credentials: {
                type: "APIKey",
                value: options.credentialsValue,
            },
        });
        /**
         * The scopes allowed.
         * @private
         */
        Object.defineProperty(this, "_scopes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * The Ratelimit helper class.
         */
        Object.defineProperty(this, "ratelimiter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The ID of the ratelimiter subject.
         */
        Object.defineProperty(this, "ratelimiterSubjectId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Whether the ratelimiter should yield instead of throwing an error.
         * @private
         */
        Object.defineProperty(this, "_ratelimiterShouldYield", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        if (options.scopes)
            this._scopes = options.scopes;
        if (options.ratelimiterShouldYield)
            this._ratelimiterShouldYield = true;
        this.ratelimiter = options.ratelimiter ??
            getOpenCloudRatelimitHelper(this.rest);
        this.ratelimiterSubjectId = options.ratelimiterSubjectId ??
            this.ratelimiter.registerSubject("Authenticated");
    }
    get scopes() {
        return this._scopes;
    }
    /**
     * Errors if the API key can not access the resource.
     * @param scopeType - The scope type.
     * @param parts - The target parts.
     * @param operation - The operation.
     * @param partsOptional - The optional parts.
     */
    canAccessResource(scopeType, parts, operation, partsOptional) {
        if (this._scopes.length === 0)
            return;
        const scopes = this._scopes.filter((scope) => scope.scopeType === scopeType &&
            // @ts-ignore: This fine.
            (scope.allowAllOperations || scope.operations.includes(operation)));
        if (scopes.length === 0) {
            throw new OpenCloudClientError(`OpenCloudClient instance can not access ${scopeType}:${operation}.`);
        }
        const canAccess = scopes.some((scope) => {
            return parts.every((part, index) => {
                return (scope.targetParts[index] === part ||
                    scope.targetParts[index] === "*" ||
                    (scope.targetParts[index] === undefined &&
                        partsOptional[index]));
            });
        });
        if (!canAccess) {
            throw new OpenCloudClientError(`OpenCloudClient instance can not access ${scopeType}:${operation} on parts [${parts.join(",")}].`);
        }
        return;
    }
    /**
     * Set the allowed scopes.
     * @param scopes - The scopes to set.
     */
    setScopes(scopes) {
        this._scopes = scopes;
    }
    /**
     * Gets a base Universe by id.
     * @param universeId - The universe to fetch.
     */
    getBaseUniverse(universeId) {
        return new BaseUniverse(this, universeId);
    }
}
