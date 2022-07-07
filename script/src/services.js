"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth = exports.oauthApplication = exports.opencloud = void 0;
const DiscoveryService_js_1 = require("./services/oauthApplication/DiscoveryService.js");
const TokenService_js_1 = require("./services/oauthApplication/TokenService.js");
const UserService_js_1 = require("./services/oauth/UserService.js");
const DataStoreService_js_1 = require("./services/opencloud/DataStoreService.js");
const MessagingService_js_1 = require("./services/opencloud/MessagingService.js");
const PlaceManagementService_js_1 = require("./services/opencloud/PlaceManagementService.js");
exports.opencloud = {
    DataStoreService: DataStoreService_js_1.DataStoreService,
    MessagingService: MessagingService_js_1.MessagingService,
    PlaceManagementService: PlaceManagementService_js_1.PlaceManagementService,
};
exports.oauthApplication = {
    DiscoveryService: DiscoveryService_js_1.DiscoveryService,
    TokenService: TokenService_js_1.TokenService,
};
exports.oauth = {
    UserService: UserService_js_1.UserService,
};
