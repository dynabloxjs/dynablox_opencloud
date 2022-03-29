import {
	type BEDEV1Error,
	parseBEDEV1Error,
} from "../utils/parseBEDEV1Error.ts";
import { parseBEDEV2Error } from "../utils/parseBEDEV2Error.ts";
import { filterObject } from "../utils/filterObject.ts";
import {
	balancedAll,
	type Output as BalancedOutput,
} from "./utils/balanced.ts";
import { HTTPResponse } from "./HTTPResponse.ts";
import * as JSONv2 from "../utils/json.ts";
import { type EnvironmentURLOptions } from "../types.ts";

/**
 * The HTTP method to request with. Custom methods are not supported.
 */
export type HTTPMethod =
	| "GET"
	| "POST"
	| "PATCH"
	| "PUT"
	| "DELETE"
	| "OPTIONS";

/**
 * The content type to expect from the server's response.
 */
export type ExpectContentType =
	| "json"
	| "text"
	| "arrayBuffer"
	| "blob"
	| "formData"
	| "none";

/**
 * Form Data input for the request. Mostly for file uploads.
 */
export interface FormDataSetRequest {
	/**
	 * Value of the FormData.
	 */
	value: string | Blob;
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
export type HTTPRequestBodyContent = {
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
	headers?: Record<string, unknown> | Headers;
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
	defaultHeaders?: Record<string, string> | Headers;
	/**
	 * Custom fetch implementation to use instead of the default `fetch`.
	 */
	fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
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
export type ClientAuthenticationInit =
	| APIKeyAuthentication
	| BearerAuthentication
	| ApplicationAuthentication;

/**
 * Error for RESTController related actions.
 */
export class RESTControllerError extends Error {
	/**
	 * BEDEV1Error and BEDEV2Errors.
	 */
	public readonly errors?: BEDEV1Error[];

	/**
	 * HTTP response code.
	 */
	public readonly httpCode?: number;

	/**
	 * Whether the error is an HHP error.
	 */
	public readonly isHttpError: boolean = false;

	constructor(
		message: string,
		isHttpError?: boolean,
		errors?: BEDEV1Error[],
		httpCode?: number,
	) {
		super(message);
		if (isHttpError) this.isHttpError = isHttpError;
		if (errors) this.errors = errors;
		if (httpCode) this.httpCode = httpCode;
	}
}

export class RESTController {
	/**
	 * Client credentials.
	 */
	private readonly _credentials: ClientAuthenticationInit;

	public get credentials() {
		return this._credentials;
	}

	/**
	 * The default headers to add to requests, values may be modified later on.
	 */
	public defaultHeaders?: Record<string, string> | Headers;

	/**
	 * Custom fetch implementation to use instead of the default `fetch`.
	 */
	public readonly fetch?: (
		input: RequestInfo,
		init?: RequestInit,
	) => Promise<Response>;

	/**
	 * String-string aliases for URLs, Whenever an a lias is found in a URL, it will attempt to format it.
	 *
	 * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it with `this.formatUrl()`, if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth".
	 */
	public readonly aliases: Record<string, string> = {};


	/**
	 * The authentication type of the client.
	 *
	 * If it is "APIKey" then it will authenticate through the OpenCloud endpoints.
	 *
	 * If it is "Bearer" then it will authenticate through the OAuth endpoints.
	 *
	 * If it is "OAuthApplication" then it will authenticate through the OAuth application endpoints.
	 */
	public get authenticationType() {
		return this._credentials.type;
	}

	/**
	 * Construct a new RESTController.
	 * @param options - The RESTController options.
	 */
	constructor(
		options: RESTControllerOptions,
	) {
		const {
			urlOptions = {
				BEDEV2Url: `apis.roblox.com/{0}`,
			},
			defaultHeaders,
			fetch,
			aliases,
			credentials,
		} = options;

		this.aliases = {
			BEDEV2Url: urlOptions.BEDEV2Url ?? "apis.roblox.com/{0}",
			...aliases,
		};
		if (defaultHeaders) this.defaultHeaders = defaultHeaders;
		if (fetch) this.fetch = fetch;

		this._credentials = credentials;
	}

	public handleRequestHeaders(
		request: InternalHTTPRequest,
		url: URL,
		contentType?: string,
	): Headers {
		let filteredHeaders = request.headers ?? {};
		if (!(filteredHeaders instanceof Headers)) {
			filteredHeaders = filterObject(filteredHeaders);
		}

		const newHeaders = new Headers(
			filteredHeaders as Headers | Record<string, string>,
		);

		if (this.defaultHeaders) {
			if (this.defaultHeaders instanceof Headers) {
				for (const [key, value] of this.defaultHeaders.entries()) {
					newHeaders.set(key, value);
				}
			} else {
				for (
					const [key, value] of Object.entries(this.defaultHeaders)
				) {
					newHeaders.set(key, value);
				}
			}
		}

		if (contentType) newHeaders.set("content-type", contentType);

		if (request.includeCredentials) {
			if (
				this._credentials.type === "APIKey" && this._credentials.value
			) {
				newHeaders.set("x-api-key", this._credentials.value);
			} else if (
				this._credentials.type === "Bearer" && this._credentials.value
			) {
				newHeaders.set(
					"authorization",
					`Bearer ${this._credentials.value}`,
				);
			}
		}

		return newHeaders;
	}

	protected async _httpRequest<Expect = unknown>(
		request: InternalHTTPRequest,
	): Promise<HTTPResponse<Expect>> {
		// handle URL
		let url: URL;
		if (request.url instanceof URL) {
			url = request.url;
		} else url = this.formatUrl(request.url, request.query);

		let newBody:
			| string
			| URLSearchParams
			| Uint8Array
			| FormData
			| BodyInit;
		let contentType: string | undefined;

		if (request.body) {
			// haddle body
			const formattedBody = this.formatBody(request.body);
			newBody = formattedBody.body;
			contentType = formattedBody.type;
		}

		const headers = this.handleRequestHeaders(request, url, contentType);

		const requestInfo: RequestInit = filterObject({
			method: request.method ?? "GET",
			headers,
			body: newBody!,
		});

		const response = await (this.fetch ?? fetch)(
			url.toString(),
			requestInfo,
		);

		return await HTTPResponse.init<Expect>(
			request,
			response,
		);
	}

	/**
	 * Public-facing request function. This is different from the protected `_httpRequest` function in a way that error handling can be done.
	 * @param request - The request parameters
	 */
	public async httpRequest<Expect = unknown>(
		request: HTTPRequest,
	): Promise<HTTPResponse<Expect>> {
		const method = request.method ?? "GET";
		const errorHandling = request.errorHandling ?? "BEDEV1";

		// handle initial headers
		let filteredHeaders = request.headers ?? {};
		if (!(filteredHeaders instanceof Headers)) {
			filteredHeaders = filterObject(filteredHeaders);
		}
		const headers = new Headers(
			filteredHeaders as Headers | Record<string, string>,
		);

		const body = request.body;

		const response = await this._httpRequest<void>({
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
				return Object.entries(error).map(([key, value]) =>
					`${key}: "${value}"`
				).join(", ");
			}).join("\n");

			throw new RESTControllerError(
				`HTTP ${response.status.code} "${response.status.text}" from ${
					request.method ?? "GET"
				} ${response.url}${
					errorsToString.length
						? `\n\n${
							request.errorHandling ?? "BEDEV1"
						} errors:\n${errorsToString}`
						: ""
				}`,
				true,
				errors as BEDEV1Error[],
				response.status.code,
			);
		}

		return await HTTPResponse.init<Expect>(
			request,
			response._response,
		);
	}

	/**
	 * Checks if the RESTController has authentication values set.
	 */
	public hasAuthentication(): boolean {
		return this._credentials.value !== undefined;
	}

	/**
	 * Format a string with aliases given a `target`. Unknown alias calles are replaced with `null`.
	 *
	 * E.g.: `RBXURL` key with value `{0}.roblox.com`. When we format it if the URL is: `{RBXURL:auth}/v1/logout`, we replace` {0}` with "auth" from alias and replace the alias call.
	 * @param target - The target to format with aliases, does not need to be a URL
	 */
	public formatWithAliases(
		target: string,
	): string {
		// Match all aliases
		const aliases: BalancedOutput[] = balancedAll("{", "}", target, false)
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
					.split(
						":",
					);

				if (this.aliases[aliasName]) {
					let targetAlias = this.aliases[aliasName];
					for (
						const [index, parameter] of Object.entries(
							parametersFormatted,
						)
					) {
						targetAlias = targetAlias.replaceAll(
							`{${index}}`,
							parameter,
						);
					}

					targetAlias = this.formatWithAliases(targetAlias);

					newTarget = newTarget.replaceAll(`{${alias}}`, targetAlias);
				} else newTarget = newTarget.replaceAll(`{${alias}}`, "null");
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
	public formatUrl(
		url: string,
		query?: URLSearchParams | Record<string, unknown>,
		protocol = "https",
	): URL {
		if (query && !(query instanceof URLSearchParams)) {
			// Filter undefined & null values
			query = new URLSearchParams(
				filterObject(query) as Record<string, string>,
			);
		}

		const formattedUrl = new URL(
			`${protocol}://${this.formatWithAliases(url)}`,
		);
		if (query) formattedUrl.search = query.toString();

		return formattedUrl;
	}

	/**
	 * Format a body to be used in requests. This will also return a `contentType` to be sent in the headers.
	 * @param body - The body to format
	 */
	public formatBody(body: HTTPRequestBodyContent): {
		body: string | URLSearchParams | Uint8Array | FormData | BodyInit;
		type?: string;
	} {
		let newBody:
			| string
			| URLSearchParams
			| Uint8Array
			| FormData
			| BodyInit
			| undefined;
		let contentType: string | undefined;

		switch (body.type) {
			case "formdata": {
				const formdata = new FormData();
				Object.entries(body.value).forEach(([name, value]) => {
					value.fileName
						? formdata.set(name, value.value, value.fileName)
						: formdata.set(name, value.value);
				});
				newBody = formdata;
				break;
			}

			case "json": {
				newBody = JSONv2.serialize(body.value);
				contentType = "application/json";
				break;
			}

			case "urlencoded": {
				newBody = new URLSearchParams(body.value);
				break;
			}

			case "unknown":
				newBody = body.value as BodyInit;
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
	public setCredentialsValue(
		credentials: ClientAuthenticationInit["value"],
	): void {
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
