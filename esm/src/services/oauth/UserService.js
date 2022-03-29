import { BaseService } from "../BaseService.js";
export class UserService extends BaseService {
    async getAuthenticataedUser() {
        return (await this.rest.httpRequest({
            url: "{BEDEV2Url:oauth}/v1/userinfo",
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
}
