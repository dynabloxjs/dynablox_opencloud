import { BaseService } from "../BaseService.js";
export class DiscoveryService extends BaseService {
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
