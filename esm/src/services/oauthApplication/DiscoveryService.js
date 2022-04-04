import { BaseService } from "../BaseService.js";
export class DiscoveryService extends BaseService {
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
}
Object.defineProperty(DiscoveryService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        getOpenidConfiguration: () => "{BEDEV2Url:oauth}/.well-known/openid-configuration",
        listJwks: () => "{BEDEV2Url:oauth}/v1/certs",
    }
});
