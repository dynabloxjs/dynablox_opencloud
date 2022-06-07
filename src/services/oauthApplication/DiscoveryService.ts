import { BaseService } from "../BaseService.ts";

export interface OpenidConfiguration {
	issuer: string;
	authorizationEndpoint: string;
	tokenEndpoint: string;
	introspectionEndpoint: string;
	revocationEndpoint: string;
	userinfoEndpoint: string;
	jwksUri: string;
	registrationEndpoint: string;
	serviceDocumentation: string;
	scopesSupported: string[];
	responseTypesSupported: string[];
	subjectTypesSupported: string[];
	idTokenSigningAlgValuesSupported: string[];
	claimsSupported: string[];
	tokenEndpointAuthMethodsSupported: string[];
}

export interface OAuthKey {
	alg: string;
	kty: string;
	kid: string;
	use: string;
	crv: string;
	x: string;
	y: string;
}

export interface ListJwksResponse {
	keys: OAuthKey[];
}

export class DiscoveryService extends BaseService {
	public static urls = {
		getOpenidConfiguration: () =>
			"{BEDEV2Url:oauth}/.well-known/openid-configuration",
		listJwks: () => "{BEDEV2Url:oauth}/v1/certs",
		listAccessTokenJwks: () =>
			"{BEDEV2Url:oauth}/v1/certificates/access-tokens",
		listIdentityTokenJwks: () =>
			"{BEDEV2Url:oauth}/v1/certificates/identity-tokens",
	};

	public async getOpenidConfiguration(): Promise<OpenidConfiguration> {
		return (await this.rest.httpRequest<OpenidConfiguration>({
			url: DiscoveryService.urls.getOpenidConfiguration(),
			errorHandling: "BEDEV2",
		})).body;
	}

	public async listJwks(): Promise<ListJwksResponse> {
		return (await this.rest.httpRequest<ListJwksResponse>({
			url: DiscoveryService.urls.listJwks(),
			errorHandling: "BEDEV2",
		})).body;
	}

	public async listAccessTokenJwks(): Promise<ListJwksResponse> {
		return (await this.rest.httpRequest<ListJwksResponse>({
			url: DiscoveryService.urls.listAccessTokenJwks(),
			errorHandling: "BEDEV2",
		})).body;
	}

	public async listIdentityTokenJwks(): Promise<ListJwksResponse> {
		return (await this.rest.httpRequest<ListJwksResponse>({
			url: DiscoveryService.urls.listIdentityTokenJwks(),
			errorHandling: "BEDEV2",
		})).body;
	}
}
