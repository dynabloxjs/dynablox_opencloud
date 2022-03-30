import { BaseService } from "../BaseService.js";
export class UserService extends BaseService {
    async getAuthenticatedUser() {
        return (await this.rest.httpRequest({
            url: "{BEDEV2Url:oauth}/v1/userinfo",
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
}
