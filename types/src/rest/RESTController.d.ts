/// <reference types="node" />
import * as dntShim from "../../_dnt.shims.js";
import { type BEDEV1Error } from "../utils/parseBEDEV1Error.js";
import { HTTPResponse } from "./HTTPResponse.js";
import { type EnvironmentURLOptions } from "../types.js";
/**
 * The HTTP method to request with. Custom methods are not supported.
 */
export declare type HTTPMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "OPTIONS";
/**
 * The content type to expect from the server's response.
 */
export declare type ExpectContentType = "json" | "text" | "arrayBuffer" | "blob" | "formData" | "none";
/**
 * Form Data input for the request. Mostly for file uploads.
 */
export interface FormDataSetRequest {
    /**
     * Value of the FormData.
     */
    value: string | dntShim.Blob;
    /**
     * File name of the blob, i.e. "blob.png".
     */
    fileName?: string;
}
/**
 * Body content with allowed types.
 *
 * **NOTE**: This isn't split into interfaces because it looks nicer.
 */
export declare type HTTPRequestBodyContent = {
    type: "json";
    value: unknown;
} | {
    type: "text";
    value: string;
} | {
    type: "formdata";
    value: Record<string, FormDataSetRequest>;
} | {
    type: "file";
    value: Uint8Array;
} | {
    type: "urlencoded";
    value: URLSearchParams | Record<string, string>;
} | {
    type: "unknown";
    value: unknown;
};
/**
 * RESTService internal HTTP request parameters.
 */
export interface InternalHTTPRequest {
    /**
     * The HTTP method to request with. Custom methods are not supported.
     */
    method?: HTTPMethod;
    /**
     * The URL for the request, if it is string and contains aliases, it will be formatted.
     */
    url: string | URL;
    /**
     * The search params to add to the URL.
     */
    query?: Record<string, unknown> | URLSearchParams;
    /**
     * The headers of the request.
     */
    headers?: Record<string, unknown> | dntShim.Headers;
    /**
     * The data type to expect as the response body.
     */
    expect?: ExpectContentType;
    /**
     * Whether it should camelize the response. Default is `true` if it starts with `{BEDEV`.
     */
    camelizeResponse?: boolean;
    /**
     * Whether to include credentials.
     */
    includeCredentials?: boolean;
    /**
     * Body content. Only valid if it's included with a request that isn't `OPTIONS` or `GET`.
     */
    body?: HTTPRequestBodyContent;
}
/**
 * RESTController public-facing HTTP request parameters.
 */
interface HTTPRequest extends InternalHTTPRequest {
    /**
     * The method to use to handle and throw errors.
     *
     * "none" will not handle any errors.
     */
    errorHandling?: "BEDEV1" | "BEDEV2" | "none";
}
/**
 * RESTController constructor options.
 */
export interface RESTControllerOptions {
    /**
     * The environment URL options.
     */
    urlOptions?: EnvironmentURLOptions;
    /**
     * The default headers to add to requests, values may be modified later on.
     */
    defaultHeaders?: Record<string, string> | dntShim.Headers;
    /**
     * Custom fetch implementation to use instead of the default `fetch`.
     */
    fetch?: (input: RequestInfo, init?: dntShim.RequestInit) => Promise<dntShim.Response>;
    /**
     * String-string of aliases, see `this.aliases` for more info
     */
    aliases?: Record<string, string>;
    /**
     * Init client credentials.
     */
    credentials: ClientAuthenticationInit;
}
/**
 * API key authentication for open cloud endpoints.
 */
interface APIKeyAuthentication {
    /**
     * API Key type for open cloud endpoints.
     */
    type: "APIKey";
    /**
     * The API key value.
     */
    value?: string;
}
/**
 * OAuth2 authentication
 */
interface BearerAuthentication {
    /**
     * OAuth2 authentication type.
     */
    type: "Bearer";
    /**
     * The bearer value.
     */
    value: string;
}
/**
 * OAuth2 application authentication.
 */
interface ApplicationAuthentication {
    /**
     * OAuth2 application type.
     */
    type: "OAuthApplication";
    /**
     * OAuth2 values to be read.
     */
    value: {
        id: string;
        secret: string;
    };
}
/**
 * Authentication credentials init.
 */
export declare type ClientAuthenticationInit = APIKeyAuthentication | BearerAuthentication | ApplicationAuthentication;
/**
 * Error for RESTController related actions.
 */
export declare class RESTControllerError extends Error {
    /**
     * BEDEV1Error and BEDEV2Errors.
     */
    readonly errors?: BEDEV1Error[];
    /**
     * HTTP response code.
     */
    readonly httpCode?: number;
    /**
     * Whether the error is an HHP error.
     */
    readonly isHttpError: boolean;
    constructor(message: string, isHttpError?: boolean, errors?: BEDEV1Error[], httpCode?: number);
}
export declare class RESTController {
    /**
     * Client credentials.
     */
    private readonly _credentials;
    get credentials(): ClientAuthenticationInit;
    /**
     * The default headers to add to requests, values may be modified later on.
     */
    defaultHeaders?: Record<string, string> | dntShim.Headers;
    /**
     * Custom fetch implementation to use instead of the default `fetch`.
     */
    readonly fetch?: (input: RequestInfo, init?: dntShim.RequestInit) => Promise<dntShim.Response>;
    /**
     * String-string aliases for URLs, Whenever an a lias is found in a URL, it will attempt to format it.
     *
     * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it with `this.formatUrl()`, if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth".
     */
    readonly aliases: Record<string, string>;
    /**
     * The authentication type of the client.
     *
     * If it is "APIKey" then it will authenticate through the OpenCloud endpoints.
     *
     * If it is "Bearer" then it will authenticate through the OAuth endpoints.
     *
     * If it is "OAuthApplication" then it will authenticate through the OAuth application endpoints.
     */
    get authenticationType(): "APIKey" | "Bearer" | "OAuthApplication";
    /**
     * Construct a new RESTController.
     * @param options - The RESTController options.
     */
    constructor(options: RESTControllerOptions);
    handleRequestHeaders(request: InternalHTTPRequest, _url: URL, contentType?: string): dntShim.Headers;
    protected _httpRequest<Expect = unknown>(request: InternalHTTPRequest): Promise<HTTPResponse<Expect>>;
    /**
     * Public-facing request function. This is different from the protected `_httpRequest` function in a way that error handling can be done.
     * @param request - The request parameters
     */
    httpRequest<Expect = unknown>(request: HTTPRequest): Promise<HTTPResponse<Expect>>;
    /**
     * Checks if the RESTController has authentication values set.
     */
    hasAuthentication(): boolean;
    /**
     * Format a string with aliases given a `target`. Unknown alias calles are replaced with `null`.
     *
     * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth" from alias and replace the alias call.
     * @param target - The target to format with aliases, does not need to be a URL
     */
    formatWithAliases(target: string): string;
    /**
     * Formats a URL given a URL string, query, protocol, and aliases. Aliases will be found and formatted with the parameters with `this.formatWithAliases(target)`
     * @param url - The target URL
     * @param query - The query to add to the URL
     * @param protocol - The target protocol (https, http, ws, wss)
     */
    formatUrl(url: string, query?: URLSearchParams | Record<string, unknown>, protocol?: string): URL;
    /**
     * Format a body to be used in requests. This will also return a `contentType` to be sent in the headers.
     * @param body - The body to format
     */
    formatBody(body: HTTPRequestBodyContent): {
        body: string | URLSearchParams | Uint8Array | dntShim.FormData | dntShim.BodyInit;
        type?: string;
    };
    /**
     * Set the current credentials value. Note: When we migrate all authentication fields to `credentials`, this will be much more type-safe.
     * @param credentials - The credentials value to set.
     */
    setCredentialsValue(credentials: ClientAuthenticationInit["value"]): void;
}
export {};
