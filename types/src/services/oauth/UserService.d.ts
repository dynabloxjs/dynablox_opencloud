import { BaseService } from "../BaseService.js";
export interface AuthenticatedUser {
    sub: string;
    name: string;
    nickname: string;
    preferredUsername: string;
    createdAt: number;
    profile?: string;
    email?: string;
    emailVerified?: boolean;
    verified?: boolean;
    ageBracket?: number;
    premium?: boolean;
    roles?: string[];
    internalUser?: boolean;
}
export declare class UserService extends BaseService {
    static urls: {
        getAuthenticatedUser: () => string;
    };
    getAuthenticatedUser(): Promise<AuthenticatedUser>;
}
