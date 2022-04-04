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
exports.OpenCloudClient = exports.OpenCloudClientError = void 0;
const dntShim = __importStar(require("../../_dnt.shims.js"));
const BaseClient_js_1 = require("./BaseClient.js");
const BaseUniverse_js_1 = require("../classes/opencloud/bases/BaseUniverse.js");
const getOpenCloudRatelimitHelper_js_1 = require("../utils/getOpenCloudRatelimitHelper.js");
const requestRetryErrorCodes = [500, 502, 504];
/**
 * OpenCloudClient error objects.
 */
class OpenCloudClientError extends Error {
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
exports.OpenCloudClientError = OpenCloudClientError;
/**
 * Open cloud client for open cloud.
 */
class OpenCloudClient extends BaseClient_js_1.BaseClient {
    constructor(options) {
        const fetchFunction = (input, init, retryNumber = 0) => {
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
                if (response.status !== 429) {
                    if (requestRetryErrorCodes.includes(response.status) &&
                        (retryNumber < this.requestRetryCount)) {
                        return new Promise((resolve) => dntShim.setTimeout(() => resolve(fetchFunction(input, init, retryNumber++)), this.requestRetryTimeout));
                    }
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
         * Retry timeout for 500, 502, and 504 responses in milliseconds.
         */
        Object.defineProperty(this, "requestRetryTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 250
        });
        /**
         * Retry count for 500, 502, and 504 responses.
         */
        Object.defineProperty(this, "requestRetryCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
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
            (0, getOpenCloudRatelimitHelper_js_1.getOpenCloudRatelimitHelper)(this.rest);
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
        return new BaseUniverse_js_1.BaseUniverse(this, universeId);
    }
}
exports.OpenCloudClient = OpenCloudClient;
