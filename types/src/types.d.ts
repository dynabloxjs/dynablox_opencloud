/**
 * Authentication type.
 */
export declare type AuthenticationType = "APIKey" | "Bearer" | "OAuthApplication";
/**
 * BEDEV Environemnt URL options for the context of the Roblox website.
 *
 * If `BEDEV2Url` is not defined, the default will be `apis.roblox.com/{0}`.
 */
export interface EnvironmentURLOptions {
    /**
     * BEDEV2 base URL for OpenCloud endpoints i.e. `apis.roblox.com/universes`, default is `apis.roblox.com/{0}`.
     */
    BEDEV2Url?: string;
}
/**
 * For services. This describes the SortOrder of "Ascending" and "Descending".
 */
export declare type SortOrderLong = "Ascending" | "Descending";
