import { BaseService } from "../BaseService.js";
export interface AuthenticatedUser {
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
export declare class UserService extends BaseService {
    getAuthenticatedUser(): Promise<AuthenticatedUser>;
}
