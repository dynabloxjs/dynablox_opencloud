"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class TokenService extends BaseService_js_1.BaseService {
    async introspectToken(token) {
        return (await this.rest.httpRequest({
            method: "POST",
            url: "{BEDEV2Url:application-authorization}/v1/token/introspect",
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
            url: "{BEDEV2Url:application-authorization}/v1/token/revoke",
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
            url: "{BEDEV2Url:application-authorization}/v1/token",
            body: {
                type: "urlencoded",
                value: urlencoded,
            },
            errorHandling: "BEDEV2",
        })).body;
    }
}
exports.TokenService = TokenService;
