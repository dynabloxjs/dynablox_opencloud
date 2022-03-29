import { BaseService } from "../BaseService.ts";

interface OpenidConfiguration {
	issuer: string;
	authorizationEndpoint: string;
	tokenEndpoint: string;
	introspectionEndpoint: string;
	revocationEndpoint: string;
	userinfoEndpoint: string;
	jwksUri: string;
	scopesSupported: string[];
	responseTypesSupported: string[];
	subjectTypesSupported: string[];
	idTokenSigningAlgValuesSupported: string[];
	claimsSupported: string[];
	tokenEndpointAuthMethodsSupported: string[];
}

interface OAuthKey {
	alg: string;
	kty: string;
	kid: string;
}

interface ListJwksResponse {
	keys: OAuthKey;
}

export class DiscoveryService extends BaseService {
	public async getOpenidConfiguration(): Promise<OpenidConfiguration> {
		return (await this.rest.httpRequest<OpenidConfiguration>({
			url: "{BEDEV2Url:application-authorization}/.well-known/openid-configuration",
			errorHandling: "BEDEV2",
		})).body;
	}

	public async listJwks(): Promise<ListJwksResponse> {
		return (await this.rest.httpRequest<ListJwksResponse>({
			url: "{BEDEV2Url:application-authorization}/v1/certs",
			errorHandling: "BEDEV2",
		})).body;
	}
}
