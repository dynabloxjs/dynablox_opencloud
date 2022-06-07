"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class DiscoveryService extends BaseService_js_1.BaseService {
    async getOpenidConfiguration() {
        return (await this.rest.httpRequest({
            url: DiscoveryService.urls.getOpenidConfiguration(),
            errorHandling: "BEDEV2",
        })).body;
    }
    async listJwks() {
        return (await this.rest.httpRequest({
            url: DiscoveryService.urls.listJwks(),
            errorHandling: "BEDEV2",
        })).body;
    }
    async listAccessTokenJwks() {
        return (await this.rest.httpRequest({
            url: DiscoveryService.urls.listAccessTokenJwks(),
            errorHandling: "BEDEV2",
        })).body;
    }
    async listIdentityTokenJwks() {
        return (await this.rest.httpRequest({
            url: DiscoveryService.urls.listIdentityTokenJwks(),
            errorHandling: "BEDEV2",
        })).body;
    }
}
exports.DiscoveryService = DiscoveryService;
Object.defineProperty(DiscoveryService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        getOpenidConfiguration: () => "{BEDEV2Url:oauth}/.well-known/openid-configuration",
        listJwks: () => "{BEDEV2Url:oauth}/v1/certs",
        listAccessTokenJwks: () => "{BEDEV2Url:oauth}/v1/certificates/access-tokens",
        listIdentityTokenJwks: () => "{BEDEV2Url:oauth}/v1/certificates/identity-tokens",
    }
});
