import { BaseService } from "../BaseService.js";
export class UserService extends BaseService {
    async getAuthenticatedUser() {
        return (await this.rest.httpRequest({
            url: UserService.urls.getAuthenticatedUser(),
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
}
Object.defineProperty(UserService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        getAuthenticatedUser: () => "{BEDEV2Url:oauth}/v1/userinfo",
    }
});
