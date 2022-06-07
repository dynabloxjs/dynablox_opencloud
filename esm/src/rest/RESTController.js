import * as dntShim from "../../_dnt.shims.js";
import { parseBEDEV1Error, } from "../utils/parseBEDEV1Error.js";
import { parseBEDEV2Error } from "../utils/parseBEDEV2Error.js";
import { filterObject } from "../utils/filterObject.js";
import { balancedAll, } from "./utils/balanced.js";
import { HTTPResponse } from "./HTTPResponse.js";
import * as JSONv2 from "../utils/json.js";
/**
 * Error for RESTController related actions.
 */
export class RESTControllerError extends Error {
    constructor(message, isHttpError, errors, httpCode) {
        super(message);
        /**
         * BEDEV1Error and BEDEV2Errors.
         */
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * HTTP response code.
         */
        Object.defineProperty(this, "httpCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Whether the error is an HHP error.
         */
        Object.defineProperty(this, "isHttpError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        if (isHttpError)
            this.isHttpError = isHttpError;
        if (errors)
            this.errors = errors;
        if (httpCode)
            this.httpCode = httpCode;
    }
}
export class RESTController {
    /**
     * Construct a new RESTController.
     * @param options - The RESTController options.
     */
    constructor(options) {
        /**
         * Client credentials.
         */
        Object.defineProperty(this, "_credentials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The default headers to add to requests, values may be modified later on.
         */
        Object.defineProperty(this, "defaultHeaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Custom fetch implementation to use instead of the default `fetch`.
         */
        Object.defineProperty(this, "fetch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * String-string aliases for URLs, Whenever an a lias is found in a URL, it will attempt to format it.
         *
         * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it with `this.formatUrl()`, if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth".
         */
        Object.defineProperty(this, "aliases", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        const { urlOptions = {
            BEDEV2Url: `apis.roblox.com/{0}`,
        }, defaultHeaders, fetch, aliases, credentials, } = options;
        this.aliases = {
            BEDEV2Url: urlOptions.BEDEV2Url ?? "apis.roblox.com/{0}",
            ...aliases,
        };
        if (defaultHeaders)
            this.defaultHeaders = defaultHeaders;
        if (fetch)
            this.fetch = fetch;
        this._credentials = credentials;
    }
    get credentials() {
        return this._credentials;
    }
    /**
     * The authentication type of the client.
     *
     * If it is "APIKey" then it will authenticate through the OpenCloud endpoints.
     *
     * If it is "Bearer" then it will authenticate through the OAuth endpoints.
     *
     * If it is "OAuthApplication" then it will authenticate through the OAuth application endpoints.
     */
    get authenticationType() {
        return this._credentials.type;
    }
    handleRequestHeaders(request, _url, contentType) {
        let filteredHeaders = request.headers ?? {};
        if (!(filteredHeaders instanceof dntShim.Headers)) {
            filteredHeaders = filterObject(filteredHeaders);
        }
        const newHeaders = new dntShim.Headers(filteredHeaders);
        if (this.defaultHeaders) {
            if (this.defaultHeaders instanceof dntShim.Headers) {
                for (const [key, value] of this.defaultHeaders.entries()) {
                    newHeaders.set(key, value);
                }
            }
            else {
                for (const [key, value] of Object.entries(this.defaultHeaders)) {
                    newHeaders.set(key, value);
                }
            }
        }
        if (contentType)
            newHeaders.set("content-type", contentType);
        if (request.includeCredentials) {
            if (this._credentials.type === "APIKey" && this._credentials.value) {
                newHeaders.set("x-api-key", this._credentials.value);
            }
            else if (this._credentials.type === "Bearer" && this._credentials.value) {
                newHeaders.set("authorization", `Bearer ${this._credentials.value}`);
            }
        }
        return newHeaders;
    }
    async _httpRequest(request) {
        // handle URL
        let url;
        if (request.url instanceof URL) {
            url = request.url;
        }
        else
            url = this.formatUrl(request.url, request.query);
        let newBody;
        let contentType;
        if (request.body) {
            // haddle body
            const formattedBody = this.formatBody(request.body);
            newBody = formattedBody.body;
            contentType = formattedBody.type;
        }
        const headers = this.handleRequestHeaders(request, url, contentType);
        const requestInfo = filterObject({
            method: request.method ?? "GET",
            headers,
            body: newBody,
        });
        const response = await (this.fetch ?? dntShim.fetch)(url.toString(), requestInfo);
        return await HTTPResponse.init(request, response);
    }
    /**
     * Public-facing request function. This is different from the protected `_httpRequest` function in a way that error handling can be done.
     * @param request - The request parameters
     */
    async httpRequest(request) {
        const errorHandling = request.errorHandling ?? "BEDEV1";
        // handle initial headers
        let filteredHeaders = request.headers ?? {};
        if (!(filteredHeaders instanceof dntShim.Headers)) {
            filteredHeaders = filterObject(filteredHeaders);
        }
        const headers = new dntShim.Headers(filteredHeaders);
        const body = request.body;
        const response = await this._httpRequest({
            method: request.method,
            url: request.url,
            query: request.query,
            headers,
            expect: "none",
            includeCredentials: request.includeCredentials,
            body,
        });
        if (request.errorHandling !== "none" && !response.status.ok) {
            // send errors to console
            const errors = await (errorHandling === "BEDEV1"
                ? parseBEDEV1Error
                : parseBEDEV2Error)(response);
            const errorsToString = errors.map((error) => {
                return Object.entries(error).map(([key, value]) => `${key}: "${Array.isArray(value) ? JSONv2.serialize(value) : value}"`).join(", ");
            }).join("\n");
            throw new RESTControllerError(`HTTP ${response.status.code} "${response.status.text}" from ${request.method ?? "GET"} ${response.url}${errorsToString.length
                ? `\n\n${request.errorHandling ?? "BEDEV1"} errors:\n${errorsToString}`
                : ""}`, true, errors, response.status.code);
        }
        return await HTTPResponse.init(request, response._response);
    }
    /**
     * Checks if the RESTController has authentication values set.
     */
    hasAuthentication() {
        return this._credentials.value !== undefined;
    }
    /**
     * Format a string with aliases given a `target`. Unknown alias calles are replaced with `null`.
     *
     * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth" from alias and replace the alias call.
     * @param target - The target to format with aliases, does not need to be a URL
     */
    formatWithAliases(target) {
        // Match all aliases
        const aliases = balancedAll("{", "}", target, false)
            .filter((match, index, localAliases) => {
            // filter out duplicates
            return localAliases.indexOf(match) === index;
        });
        let newTarget = target;
        for (const { body: alias } of aliases) {
            const aliasMatch = alias.match(/([^:]+):?(.*)/);
            if (aliasMatch) {
                const [, aliasName, parameters] = aliasMatch;
                const parametersFormatted = this.formatWithAliases(parameters)
                    .split(":");
                if (this.aliases[aliasName]) {
                    let targetAlias = this.aliases[aliasName];
                    for (const [index, parameter] of Object.entries(parametersFormatted)) {
                        targetAlias = targetAlias.replaceAll(`{${index}}`, parameter);
                    }
                    targetAlias = this.formatWithAliases(targetAlias);
                    newTarget = newTarget.replaceAll(`{${alias}}`, targetAlias);
                }
                else
                    newTarget = newTarget.replaceAll(`{${alias}}`, "null");
            }
        }
        return newTarget;
    }
    /**
     * Formats a URL given a URL string, query, protocol, and aliases. Aliases will be found and formatted with the parameters with `this.formatWithAliases(target)`
     * @param url - The target URL
     * @param query - The query to add to the URL
     * @param protocol - The target protocol (https, http, ws, wss)
     */
    formatUrl(url, query, protocol = "https") {
        if (query && !(query instanceof URLSearchParams)) {
            // Filter undefined & null values
            query = new URLSearchParams(filterObject(query));
        }
        const formattedUrl = new URL(`${protocol}://${this.formatWithAliases(url)}`);
        if (query)
            formattedUrl.search = query.toString();
        return formattedUrl;
    }
    /**
     * Format a body to be used in requests. This will also return a `contentType` to be sent in the headers.
     * @param body - The body to format
     */
    formatBody(body) {
        let newBody;
        let contentType;
        switch (body.type) {
            case "formdata": {
                const formdata = new dntShim.FormData();
                Object.entries(body.value).forEach(([name, value]) => {
                    value.fileName
                        ? formdata.set(name, value.value, value.fileName)
                        : formdata.set(name, value.value);
                });
                newBody = formdata;
                break;
            }
            case "json": {
                newBody = JSONv2.serialize(body.value, undefined, body.lua);
                contentType = "application/json";
                break;
            }
            case "urlencoded": {
                newBody = new URLSearchParams(body.value);
                break;
            }
            case "unknown":
                newBody = body.value;
                break;
            default: {
                newBody = body.value;
                break;
            }
        }
        return {
            body: newBody,
            type: contentType,
        };
    }
    /**
     * Set the current credentials value. Note: When we migrate all authentication fields to `credentials`, this will be much more type-safe.
     * @param credentials - The credentials value to set.
     */
    setCredentialsValue(credentials) {
        switch (this._credentials.type) {
            case "Bearer": {
                if (typeof credentials === "string") {
                    this._credentials.value = credentials;
                }
                break;
            }
            case "APIKey": {
                if (typeof credentials === "string") {
                    this._credentials.value = credentials;
                }
                break;
            }
            case "OAuthApplication": {
                if (typeof credentials === "object") {
                    this._credentials.value = credentials;
                }
                break;
            }
        }
    }
}
