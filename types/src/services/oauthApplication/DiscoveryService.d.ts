import { BaseService } from "../BaseService.js";
export interface OpenidConfiguration {
    issuer: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    introspectionEndpoint: string;
    revocationEndpoint: string;
    userinfoEndpoint: string;
    jwksUri: string;
    registrationEndpoint: string;
    serviceDocumentation: string;
    scopesSupported: string[];
    responseTypesSupported: string[];
    subjectTypesSupported: string[];
    idTokenSigningAlgValuesSupported: string[];
    claimsSupported: string[];
    tokenEndpointAuthMethodsSupported: string[];
}
export interface OAuthKey {
    alg: string;
    kty: string;
    kid: string;
    use: string;
    crv: string;
    x: string;
    y: string;
}
export interface ListJwksResponse {
    keys: OAuthKey[];
}
export declare class DiscoveryService extends BaseService {
    static urls: {
        getOpenidConfiguration: () => string;
        listJwks: () => string;
        listAccessTokenJwks: () => string;
        listIdentityTokenJwks: () => string;
    };
    getOpenidConfiguration(): Promise<OpenidConfiguration>;
    listJwks(): Promise<ListJwksResponse>;
    listAccessTokenJwks(): Promise<ListJwksResponse>;
    listIdentityTokenJwks(): Promise<ListJwksResponse>;
}
