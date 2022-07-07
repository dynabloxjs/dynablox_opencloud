import { BaseClient } from "./BaseClient.ts";
import { BaseUniverse } from "../classes/opencloud/bases/BaseUniverse.ts";
import { getOpenCloudRatelimitHelper } from "../utils/getOpenCloudRatelimitHelper.ts";
import { type RatelimitHelper } from "../helpers/RatelimitHelper.ts";
import { type EnvironmentURLOptions } from "../types.ts";
import { type HTTPMethod } from "../rest/RESTController.ts";

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

export type Scope =
	| UniversePlacesScope
	| UniverseDataStoresObjectsScope
	| UniverseDataStoresVersionsScope
	| UniverseDataStoresControlScope
	| UniverseMessagingServiceScope;

const requestRetryErrorCodes = [500, 502, 504];

/**
 * OpenCloudClient error objects.
 */
export class OpenCloudClientError extends Error {
	public tryAgainIn?: Date;
	constructor(message: string, tryAgainIn?: Date) {
		super(message);
		this.tryAgainIn = tryAgainIn;
	}
}

/**
 * Open cloud client for open cloud.
 */
export class OpenCloudClient extends BaseClient {
	/**
	 * The scopes allowed.
	 * @private
	 */
	private _scopes: Scope[] = [];

	public get scopes() {
		return this._scopes;
	}

	/**
	 * The Ratelimit helper class.
	 */
	public readonly ratelimiter: RatelimitHelper;

	/**
	 * The ID of the ratelimiter subject.
	 */
	public readonly ratelimiterSubjectId: number;

	/**
	 * Retry timeout for 500, 502, and 504 responses in milliseconds.
	 */
	public readonly requestRetryTimeout: number = 250;

	/**
	 * Retry count for 500, 502, and 504 responses.
	 */
	public readonly requestRetryCount: number = 5;

	/**
	 * Whether the ratelimiter should yield instead of throwing an error.
	 * @private
	 */
	private readonly _ratelimiterShouldYield: boolean = false;

	/**
	 * Errors if the API key can not access the resource.
	 * @param scopeType - The scope type.
	 * @param parts - The target parts.
	 * @param operation - The operation.
	 * @param partsOptional - The optional parts.
	 */
	public canAccessResource<ScopeType extends Scope["scopeType"]>(
		scopeType: ScopeType,
		parts: Extract<Scope, {
			scopeType: ScopeType;
		}>["targetParts"],
		operation: Extract<Scope, {
			scopeType: ScopeType;
		}>["operations"][number],
		partsOptional: boolean[],
	): void {
		if (this._scopes.length === 0) return;

		const scopes = this._scopes.filter((scope) =>
			scope.scopeType === scopeType &&
			// @ts-ignore: This fine.
			(scope.allowAllOperations || scope.operations.includes(operation))
		);
		if (scopes.length === 0) {
			throw new OpenCloudClientError(
				`OpenCloudClient instance can not access ${scopeType}:${operation}.`,
			);
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
			throw new OpenCloudClientError(
				`OpenCloudClient instance can not access ${scopeType}:${operation} on parts [${
					parts.join(",")
				}].`,
			);
		}
		return;
	}

	/**
	 * Set the allowed scopes.
	 * @param scopes - The scopes to set.
	 */
	public setScopes(scopes: Scope[]): void {
		this._scopes = scopes;
	}

	constructor(options: OpenCloudClientOptions) {
		const fetchFunction = (
			input: RequestInfo | string,
			init?: RequestInit,
			retryNumber = 0,
		): Promise<Response> => {
			const url = new URL(
				typeof input === "string" ? input : input.url,
			);
			const method = (init?.method ?? "GET") as HTTPMethod;

			if (
				!this.ratelimiter.getRequestAvailability(
					method,
					url,
					this.ratelimiterSubjectId,
				)
			) {
				const nextRequestTime = this.ratelimiter
					.getNextRequestAvailability(
						method,
						url,
						this.ratelimiterSubjectId,
					);

				if (nextRequestTime && this._ratelimiterShouldYield) {
					return new Promise<Response>((resolve) =>
						setTimeout(
							() => resolve(fetchFunction(input, init)),
							nextRequestTime.getTime() - Date.now(),
						)
					);
				}

				throw new OpenCloudClientError(
					`${method} "${url.toString()}" reached the maximum amount of requests for the time period. Try again on ${
						nextRequestTime?.toLocaleString() ?? "never"
					}.`,
					nextRequestTime,
				);
			}

			// @ts-ignore: Ignore this in DNT please.
			return (options.base?.fetch ?? fetch)(input, init).then(
				(response) => {
					if (response.status !== 429) {
						if (
							requestRetryErrorCodes.includes(response.status) &&
							(retryNumber < this.requestRetryCount)
						) {
							return new Promise(
								(resolve) =>
									setTimeout(() =>
										resolve(
											fetchFunction(
												input,
												init,
												retryNumber++,
											),
										), this.requestRetryTimeout),
							);
						}
						this.ratelimiter.incrementRatelimits(
							method,
							url,
							this.ratelimiterSubjectId,
						);
					}

					return response;
				},
			);
		};

		super({
			...options?.base,
			fetch: fetchFunction,
			credentials: {
				type: "APIKey",
				value: options.credentialsValue,
			},
		});
		if (options.scopes) this._scopes = options.scopes;
		if (options.ratelimiterShouldYield) this._ratelimiterShouldYield = true;
		if (options.requestRetryCount !== undefined) {
			this.requestRetryCount = options.requestRetryCount;
		}
		if (options.requestRetryTimeout !== undefined) {
			this.requestRetryTimeout = options.requestRetryTimeout;
		}

		this.ratelimiter = options.ratelimiter ??
			getOpenCloudRatelimitHelper(this.rest);
		this.ratelimiterSubjectId = options.ratelimiterSubjectId ??
			this.ratelimiter.registerSubject("Authenticated");
	}

	/**
	 * Gets a base Universe by id.
	 * @param universeId - The universe to fetch.
	 */
	public getBaseUniverse(universeId: number): BaseUniverse {
		return new BaseUniverse(this, universeId);
	}
}
