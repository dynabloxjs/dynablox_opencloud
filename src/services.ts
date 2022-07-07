import { DiscoveryService } from "./services/oauthApplication/DiscoveryService.ts";
import { TokenService } from "./services/oauthApplication/TokenService.ts";

import { UserService } from "./services/oauth/UserService.ts";

import { DataStoreService } from "./services/opencloud/DataStoreService.ts";
import { MessagingService } from "./services/opencloud/MessagingService.ts";
import { PlaceManagementService } from "./services/opencloud/PlaceManagementService.ts";

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
