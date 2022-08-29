import { BaseService } from "../BaseService.ts";

export interface AuthenticatedUser {
	sub: string;
	name: string;
	nickname: string;
	preferredUsername: string;
	createdAt: string;
	profile?: string;
	email?: string;
	emailVerified?: boolean;
	verified?: boolean;
	ageBracket?: number;
	premium?: boolean;
}

export class UserService extends BaseService {
	public static urls = {
		getAuthenticatedUser: () => "{BEDEV2Url:oauth}/v1/userinfo",
	};

	public async getAuthenticatedUser(): Promise<AuthenticatedUser> {
		return (await this.rest.httpRequest<AuthenticatedUser>({
			url: UserService.urls.getAuthenticatedUser(),
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}
}
