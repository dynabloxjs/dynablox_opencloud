import { BaseService } from "../BaseService.js";
interface TokenIntrospection {
    active: boolean;
    jti: string;
    iss: string;
    tokenType: string;
    clientId: string;
    aud: string;
    sub: string;
    subType: string;
    auid: string;
    scope: string;
    exp: number;
    iat: string;
}
interface OAuthToken {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    idToken?: string;
}
export declare class TokenService extends BaseService {
    introspectToken(token: string): Promise<TokenIntrospection>;
    revokeToken(token: string): Promise<void>;
    useCode(grantType: string, code: string, refreshToken?: string, codeVerifier?: string): Promise<OAuthToken>;
}
export {};
