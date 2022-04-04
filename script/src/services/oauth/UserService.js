"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class UserService extends BaseService_js_1.BaseService {
    async getAuthenticatedUser() {
        return (await this.rest.httpRequest({
            url: UserService.urls.getAuthenticatedUser(),
            errorHandling: "BEDEV2",
            includeCredentials: true,
        })).body;
    }
}
exports.UserService = UserService;
Object.defineProperty(UserService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        getAuthenticatedUser: () => "{BEDEV2Url:oauth}/v1/userinfo",
    }
});
