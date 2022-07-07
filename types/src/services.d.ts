import { DiscoveryService } from "./services/oauthApplication/DiscoveryService.js";
import { TokenService } from "./services/oauthApplication/TokenService.js";
import { UserService } from "./services/oauth/UserService.js";
import { DataStoreService } from "./services/opencloud/DataStoreService.js";
import { MessagingService } from "./services/opencloud/MessagingService.js";
import { PlaceManagementService } from "./services/opencloud/PlaceManagementService.js";
export declare const opencloud: {
    DataStoreService: typeof DataStoreService;
    MessagingService: typeof MessagingService;
    PlaceManagementService: typeof PlaceManagementService;
};
export declare const oauthApplication: {
    DiscoveryService: typeof DiscoveryService;
    TokenService: typeof TokenService;
};
export declare const oauth: {
    UserService: typeof UserService;
};
