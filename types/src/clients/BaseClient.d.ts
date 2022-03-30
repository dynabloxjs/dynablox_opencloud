import * as dntShim from "../../_dnt.shims.js";
import * as services from "../services.js";
import { RESTController, type ClientAuthenticationInit as RESTClientAuthentication } from "../rest/RESTController.js";
import { type EnvironmentURLOptions } from "../types.js";
/**
 * Services type for the prototypes of all services.
 */
declare type Services = {
    opencloud: {
        [K in keyof typeof services.opencloud]: typeof services.opencloud[K]["prototype"];
    };
    oauthApplication: {
        [K in keyof typeof services.oauthApplication]: typeof services.oauthApplication[K]["prototype"];
    };
    oauth: {
        [K in keyof typeof services.oauth]: typeof services.oauth[K]["prototype"];
    };
};
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
 * Authentication credentials.
 */
declare type ClientAuthentication = APIKeyAuthentication | BearerAuthentication | ApplicationAuthentication;
/**
 * BaseClient options.
 */
interface BaseClientOptions {
    /**
     * Basic credentials that include a `type` and `value`.
     */
    credentials: ClientAuthentication;
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
 * Error for BaseClient related actions.
 */
export declare class BaseClientError extends Error {
    constructor(message: string);
}
/**
 * The BaseClient for the API client. This is to be extended by other clients.
 *
 * Includes the barebone structure for all API clients.
 */
export declare class BaseClient {
    /**
     * The authentication type of the BaseClient.
     */
    get authenticationType(): "APIKey" | "Bearer" | "OAuthApplication";
    get credentials(): RESTClientAuthentication;
    /**
     * The RESTController to be used in the entirety of the client. It is used for requesting data and managing data.
     */
    readonly rest: RESTController;
    /**
     * The services that utillize the RESTController and have their own methods for interacting with the Roblox web API.
     */
    readonly services: Services;
    /**
     * Constructs a new BaseClient with the `credentials`, `environmentURLOptions`, and `aliases`.
     * @param options - The options to pass into the constructor.
     */
    constructor(options: BaseClientOptions);
    /**
     * Set the default headers from the RESTController.
     * @param headers - The new default headers.
     */
    setDefaultHeaders(headers: Record<string, string> | dntShim.Headers): void;
    /**
     * Set the current credentials value.
     * @param credentials - The credentials to set.
     */
    setCredentialsValue(credentials: ClientAuthentication["value"]): void;
}
export {};
