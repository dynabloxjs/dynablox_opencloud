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
exports.BaseClient = exports.BaseClientError = void 0;
const services = __importStar(require("../services.js"));
const RESTController_js_1 = require("../rest/RESTController.js");
/**
 * Error for BaseClient related actions.
 */
class BaseClientError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.BaseClientError = BaseClientError;
/**
 * The BaseClient for the API client. This is to be extended by other clients.
 *
 * Includes the barebone structure for all API clients.
 */
class BaseClient {
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
        const rest = new RESTController_js_1.RESTController({
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
        this.rest.setCredentialsValue(credentials);
    }
}
exports.BaseClient = BaseClient;
