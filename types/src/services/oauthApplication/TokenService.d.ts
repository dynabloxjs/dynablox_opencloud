import { BaseService } from "../BaseService.js";
export interface TokenIntrospection {
    active: boolean;
    jti: string;
    iss: string;
    tokenType: string;
    clientId: string;
    aud: string;
    sub: string;
    scope: string;
    exp: number;
    iat: string;
}
export interface OAuthToken {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    idToken?: string;
    scope?: string;
}
export declare type ApplicationOwnerType = "User" | "Group";
export interface ApplicationOwner {
    id: number;
    type: ApplicationOwnerType;
}
export interface TokenAuthorizationResourceIds {
    ids: number[];
}
export interface TokenAuthorizationResource {
    owner: ApplicationOwner;
    resources: TokenAuthorizationResourceIds;
}
export interface TokenAuthorizationResources {
    resourceInfos: TokenAuthorizationResource[];
}
export declare class TokenService extends BaseService {
    static urls: {
        introspectToken: () => string;
        revokeToken: () => string;
        useCode: () => string;
        listAuthorizationResources: () => string;
    };
    introspectToken(token: string): Promise<TokenIntrospection>;
    revokeToken(token: string): Promise<void>;
    useCode(grantType: string, code: string, refreshToken?: string, codeVerifier?: string): Promise<OAuthToken>;
    listAuthorizationResources(token?: string): Promise<TokenAuthorizationResources>;
}
