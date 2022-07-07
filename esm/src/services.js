import { DiscoveryService } from "./services/oauthApplication/DiscoveryService.js";
import { TokenService } from "./services/oauthApplication/TokenService.js";
import { UserService } from "./services/oauth/UserService.js";
import { DataStoreService } from "./services/opencloud/DataStoreService.js";
import { MessagingService } from "./services/opencloud/MessagingService.js";
import { PlaceManagementService } from "./services/opencloud/PlaceManagementService.js";
export const opencloud = {
    DataStoreService,
    MessagingService,
    PlaceManagementService,
};
export const oauthApplication = {
    DiscoveryService,
    TokenService,
};
export const oauth = {
    UserService,
};
