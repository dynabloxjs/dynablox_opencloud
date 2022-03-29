"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class DiscoveryService extends BaseService_js_1.BaseService {
    async getOpenidConfiguration() {
        return (await this.rest.httpRequest({
            url: "{BEDEV2Url:application-authorization}/.well-known/openid-configuration",
            errorHandling: "BEDEV2",
        })).body;
    }
    async listJwks() {
        return (await this.rest.httpRequest({
            url: "{BEDEV2Url:application-authorization}/v1/certs",
            errorHandling: "BEDEV2",
        })).body;
    }
}
exports.DiscoveryService = DiscoveryService;
