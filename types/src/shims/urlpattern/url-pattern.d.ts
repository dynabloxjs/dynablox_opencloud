import { URLPatternInit, URLPatternResult } from "./url-pattern.interfaces.js";
export declare class URLPattern {
    private pattern;
    private regexp;
    private keys;
    private component_pattern;
    constructor(init?: URLPatternInit | string, baseURL?: string);
    test(input?: string | URLPatternInit, baseURL?: string): boolean;
    exec(input?: string | URLPatternInit, baseURL?: string): URLPatternResult | null | undefined;
    get protocol(): any;
    get username(): any;
    get password(): any;
    get hostname(): any;
    get port(): any;
    get pathname(): any;
    get search(): any;
    get hash(): any;
}
