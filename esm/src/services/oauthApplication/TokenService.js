import { BaseService } from "../BaseService.js";
export class TokenService extends BaseService {
    async introspectToken(token) {
        return (await this.rest.httpRequest({
            method: "POST",
            url: TokenService.urls.introspectToken(),
            body: {
                type: "urlencoded",
                value: {
                    "client_id": this.rest.credentials.type === "OAuthApplication"
                        ? (this.rest.credentials.value?.id) ?? ""
                        : "",
                    "client_secret": this.rest.credentials.type === "OAuthApplication"
                        ? (this.rest.credentials.value?.secret) ?? ""
                        : "",
                    token,
                },
            },
            errorHandling: "BEDEV2",
        })).body;
    }
    async revokeToken(token) {
        await this.rest.httpRequest({
            method: "POST",
            url: TokenService.urls.revokeToken(),
            body: {
                type: "urlencoded",
                value: {
                    "client_id": this.rest.credentials.type === "OAuthApplication"
                        ? (this.rest.credentials.value?.id) ?? ""
                        : "",
                    "client_secret": this.rest.credentials.type === "OAuthApplication"
                        ? (this.rest.credentials.value?.secret) ?? ""
                        : "",
                    token,
                },
            },
            expect: "none",
            errorHandling: "BEDEV2",
        });
    }
    async useCode(grantType, code, refreshToken, codeVerifier) {
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
        if (refreshToken)
            urlencoded.set("refresh_token", refreshToken);
        if (codeVerifier)
            urlencoded.set("code_verifier", codeVerifier);
        return (await this.rest.httpRequest({
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
Object.defineProperty(TokenService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        introspectToken: () => "{BEDEV2Url:application-authorization}/v1/token/introspect",
        revokeToken: () => "{BEDEV2Url:application-authorization}/v1/token/revoke",
        useCode: () => "{BEDEV2Url:application-authorization}/v1/token",
    }
});
