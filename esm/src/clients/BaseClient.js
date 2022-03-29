import * as services from "../services.js";
import { RESTController } from "../rest/RESTController.js";
/**
 * Error for BaseClient related actions.
 */
export class BaseClientError extends Error {
    constructor(message) {
        super(message);
    }
}
/**
 * The BaseClient for the API client. This is to be extended by other clients.
 *
 * Includes the barebone structure for all API clients.
 */
export class BaseClient {
    /**
     * Constructs a new BaseClient with the `credentials`, `environmentURLOptions`, and `aliases`.
     * @param options - The options to pass into the constructor.
     */
    constructor(options) {
        /**
         * The RESTController to be used in the entirety of the client. It is used for requesting data and managing data.
         */
        Object.defineProperty(this, "rest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The services that utillize the RESTController and have their own methods for interacting with the Roblox web API.
         */
        Object.defineProperty(this, "services", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                opencloud: {},
                oauthApplication: {},
                oauth: {},
            }
        });
        const { credentials, environmentURLOptions, defaultHeaders, fetch, aliases, } = options;
        const rest = new RESTController({
            urlOptions: environmentURLOptions,
            defaultHeaders,
            fetch,
            aliases,
            credentials,
        });
        this.rest = rest;
        // Create services
        for (const [type, servicesValue] of Object.entries(services)) {
            for (const [service, serviceValue] of Object.entries(servicesValue)) {
                // @ts-ignore: I believe this should be possible.
                this.services[type][service] = new serviceValue(rest);
            }
        }
    }
    /**
     * The authentication type of the BaseClient.
     */
    get authenticationType() {
        return this.rest.authenticationType;
    }
    get credentials() {
        return this.rest.credentials;
    }
    /**
     * Set the default headers from the RESTController.
     * @param headers - The new default headers.
     */
    setDefaultHeaders(headers) {
        this.rest.defaultHeaders = headers;
    }
    /**
     * Set the current credentials value.
     * @param credentials - The credentials to set.
     */
    setCredentialsValue(credentials) {
        if (!credentials)
            return;
        this.setCredentialsValue(credentials);
    }
}
