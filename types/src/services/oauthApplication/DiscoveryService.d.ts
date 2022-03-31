import { BaseService } from "../BaseService.js";
export interface OpenidConfiguration {
    issuer: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    introspectionEndpoint: string;
    revocationEndpoint: string;
    userinfoEndpoint: string;
    jwksUri: string;
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
}
export interface ListJwksResponse {
    keys: OAuthKey;
}
export declare class DiscoveryService extends BaseService {
    getOpenidConfiguration(): Promise<OpenidConfiguration>;
    listJwks(): Promise<ListJwksResponse>;
}
