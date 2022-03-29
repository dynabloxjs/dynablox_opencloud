import * as services from "../services.ts";
import {
	type ClientAuthenticationInit as RESTClientAuthentication,
	RESTController,
} from "../rest/RESTController.ts";
import { type EnvironmentURLOptions } from "../types.ts";

/**
 * Services type for the prototypes of all services.
 */
type Services = {
	opencloud: {
		[K in keyof typeof services.opencloud]:
			typeof services.opencloud[K]["prototype"];
	};
	oauthApplication: {
		[K in keyof typeof services.oauthApplication]:
			typeof services.oauthApplication[K]["prototype"];
	};
	oauth: {
		[K in keyof typeof services.oauth]:
			typeof services.oauth[K]["prototype"];
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
type ClientAuthentication =
	| APIKeyAuthentication
	| BearerAuthentication
	| ApplicationAuthentication;

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
	defaultHeaders?: Record<string, string> | Headers;
	/**
	 * Custom fetch implementation to use instead of the default `fetch`.
	 */
	fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
	/**
	 * Aliases for strings in URLs. See more information in RESTController.ts
	 */
	aliases?: Record<string, string>;
}

/**
 * Error for BaseClient related actions.
 */
export class BaseClientError extends Error {
	constructor(message: string) {
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
	 * The authentication type of the BaseClient.
	 */
	public get authenticationType() {
		return this.rest.authenticationType;
	}

	public get credentials(): RESTClientAuthentication {
		return this.rest.credentials as RESTClientAuthentication;
	}

	/**
	 * The RESTController to be used in the entirety of the client. It is used for requesting data and managing data.
	 */
	public readonly rest: RESTController;

	/**
	 * The services that utillize the RESTController and have their own methods for interacting with the Roblox web API.
	 */
	public readonly services: Services = {
		opencloud: {},
		oauthApplication: {},
		oauth: {},
	} as Services;

	/**
	 * Constructs a new BaseClient with the `credentials`, `environmentURLOptions`, and `aliases`.
	 * @param options - The options to pass into the constructor.
	 */
	constructor(
		options: BaseClientOptions,
	) {
		const {
			credentials,
			environmentURLOptions,
			defaultHeaders,
			fetch,
			aliases,
		} = options;

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
			for (
				const [service, serviceValue] of Object.entries(servicesValue)
			) {
				// @ts-ignore: I believe this should be possible.
				this.services[type][service] = new serviceValue(rest);
			}
		}
	}

	/**
	 * Set the default headers from the RESTController.
	 * @param headers - The new default headers.
	 */
	public setDefaultHeaders(headers: Record<string, string> | Headers): void {
		this.rest.defaultHeaders = headers;
	}

	/**
	 * Set the current credentials value.
	 * @param credentials - The credentials to set.
	 */
	public setCredentialsValue(
		credentials: ClientAuthentication["value"],
	): void {
		if (!credentials) return;

		this.setCredentialsValue(credentials);
	}
}
