"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class TokenService extends BaseService_js_1.BaseService {
    async introspectToken(token) {
        const params = new URLSearchParams({
            token,
        });
        if (this.rest.credentials.type === "OAuthApplication") {
            params.set("client_id", this.rest.credentials.value.id);
            params.set("client_secret", this.rest.credentials.value.secret);
        }
        return (await this.rest.httpRequest({
            method: "POST",
            url: TokenService.urls.introspectToken(),
            body: {
                type: "urlencoded",
                value: params,
            },
            errorHandling: "BEDEV2",
        })).body;
    }
    async revokeToken(token) {
        const params = new URLSearchParams({
            token,
        });
        if (this.rest.credentials.type === "OAuthApplication") {
            params.set("client_id", this.rest.credentials.value.id);
            params.set("client_secret", this.rest.credentials.value.secret);
        }
        await this.rest.httpRequest({
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
    async useCode(grantType, code, refreshToken, codeVerifier) {
        const params = new URLSearchParams({
            grantType,
            code,
        });
        if (this.rest.credentials.type === "OAuthApplication") {
            params.set("client_id", this.rest.credentials.value.id);
            params.set("client_secret", this.rest.credentials.value.secret);
        }
        if (refreshToken)
            params.set("refresh_token", refreshToken);
        if (codeVerifier)
            params.set("code_verifier", codeVerifier);
        return (await this.rest.httpRequest({
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
exports.TokenService = TokenService;
Object.defineProperty(TokenService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        introspectToken: () => "{BEDEV2Url:oauth}/v1/token/introspect",
        revokeToken: () => "{BEDEV2Url:oauth}/v1/token/revoke",
        useCode: () => "{BEDEV2Url:oauth}/v1/token",
    }
});
