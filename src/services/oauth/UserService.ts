import { BaseService } from "../BaseService.ts";

interface AuthenticatedUser {
	sub: string;
	subType: string;
	name: string;
	nickname: string;
	preferredUsername: string;
	profile: string;
	email?: string;
	emailVerified?: boolean;
	verified?: boolean;
}

export class UserService extends BaseService {
	public async getAuthenticatedUser(): Promise<AuthenticatedUser> {
		return (await this.rest.httpRequest<AuthenticatedUser>({
			url: "{BEDEV2Url:oauth}/v1/userinfo",
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}
}
