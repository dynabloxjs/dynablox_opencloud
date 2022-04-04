import { BaseService } from "../BaseService.ts";

export interface TokenIntrospection {
	active: boolean;
	jti: string;
	iss: string;
	tokenType: string;
	clientId: string;
	aud: string;
	sub: string;
	subType: string;
	auid: string;
	scope: string;
	exp: number;
	iat: string;
}

export interface OAuthToken {
	accessToken: string;
	refreshToken?: string;
	tokenType: string;
	expiresIn: number;
	idToken?: string;
}

export class TokenService extends BaseService {
	public static urls = {
		introspectToken: () =>
			"{BEDEV2Url:application-authorization}/v1/token/introspect",
		revokeToken: () =>
			"{BEDEV2Url:application-authorization}/v1/token/revoke",
		useCode: () => "{BEDEV2Url:application-authorization}/v1/token",
	};

	public async introspectToken(token: string): Promise<TokenIntrospection> {
		return (await this.rest.httpRequest<TokenIntrospection>({
			method: "POST",
			url: TokenService.urls.introspectToken(),
			body: {
				type: "urlencoded",
				value: {
					"client_id":
						this.rest.credentials.type === "OAuthApplication"
							? (this.rest.credentials.value?.id) ?? ""
							: "",
					"client_secret":
						this.rest.credentials.type === "OAuthApplication"
							? (this.rest.credentials.value?.secret) ?? ""
							: "",
					token,
				},
			},
			errorHandling: "BEDEV2",
		})).body;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.rest.httpRequest<void>({
			method: "POST",
			url: TokenService.urls.revokeToken(),
			body: {
				type: "urlencoded",
				value: {
					"client_id":
						this.rest.credentials.type === "OAuthApplication"
							? (this.rest.credentials.value?.id) ?? ""
							: "",
					"client_secret":
						this.rest.credentials.type === "OAuthApplication"
							? (this.rest.credentials.value?.secret) ?? ""
							: "",
					token,
				},
			},
			expect: "none",
			errorHandling: "BEDEV2",
		});
	}

	public async useCode(
		grantType: string,
		code: string,
		refreshToken?: string,
		codeVerifier?: string,
	): Promise<OAuthToken> {
		const urlencoded = new URLSearchParams({
			"client_id": this.rest.credentials.type === "OAuthApplication"
				? (this.rest.credentials.value?.id) ?? ""
				: "",
			"client_secret": this.rest.credentials.type === "OAuthApplication"
				? (this.rest.credentials.value?.secret) ?? ""
				: "",
			grantType,
			code,
		});
		if (refreshToken) urlencoded.set("refresh_token", refreshToken);
		if (codeVerifier) urlencoded.set("code_verifier", codeVerifier);

		return (await this.rest.httpRequest<OAuthToken>({
			method: "POST",
			url: TokenService.urls.useCode(),
			body: {
				type: "urlencoded",
				value: urlencoded,
			},
			errorHandling: "BEDEV2",
		})).body;
	}
}
