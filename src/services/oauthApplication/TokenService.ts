import { BaseService } from "../BaseService.ts";

export interface TokenIntrospection {
	active: boolean;
	jti: string;
	iss: string;
	tokenType: string;
	clientId: string;
	aud: string;
	sub: string;
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
	scope?: string;
}

export class TokenService extends BaseService {
	public static urls = {
		introspectToken: () => "{BEDEV2Url:oauth}/v1/token/introspect",
		revokeToken: () => "{BEDEV2Url:oauth}/v1/token/revoke",
		useCode: () => "{BEDEV2Url:oauth}/v1/token",
	};

	public async introspectToken(token: string): Promise<TokenIntrospection> {
		const params = new URLSearchParams({
			token,
		});
		if (this.rest.credentials.type === "OAuthApplication") {
			params.set("client_id", this.rest.credentials.value.id);
			params.set("client_secret", this.rest.credentials.value.secret);
		}

		return (await this.rest.httpRequest<TokenIntrospection>({
			method: "POST",
			url: TokenService.urls.introspectToken(),
			body: {
				type: "urlencoded",
				value: params,
			},
			errorHandling: "BEDEV2",
		})).body;
	}

	public async revokeToken(token: string): Promise<void> {
		const params = new URLSearchParams({
			token,
		});
		if (this.rest.credentials.type === "OAuthApplication") {
			params.set("client_id", this.rest.credentials.value.id);
			params.set("client_secret", this.rest.credentials.value.secret);
		}

		await this.rest.httpRequest<void>({
			method: "POST",
			url: TokenService.urls.revokeToken(),
			body: {
				type: "urlencoded",
				value: params,
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
		const params = new URLSearchParams({
			grantType,
			code,
		});
		if (this.rest.credentials.type === "OAuthApplication") {
			params.set("client_id", this.rest.credentials.value.id);
			params.set("client_secret", this.rest.credentials.value.secret);
		}

		if (refreshToken) params.set("refresh_token", refreshToken);
		if (codeVerifier) params.set("code_verifier", codeVerifier);

		return (await this.rest.httpRequest<OAuthToken>({
			method: "POST",
			url: TokenService.urls.useCode(),
			body: {
				type: "urlencoded",
				value: params,
			},
			errorHandling: "BEDEV2",
		})).body;
	}
}
