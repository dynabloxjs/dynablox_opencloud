import * as dntShim from "../../_dnt.shims.js";
import { type HTTPMethod as Method } from "../rest/RESTController.js";
declare type Limitation = "All" | "AuthenticatedIP" | "NotAuthenticated" | "Authenticated";
declare type RegisterIdentifierType = "Authenticated";
interface SubjectRatelimit {
    index: number;
    origin: Limitation;
    count: number;
    startTime?: Date;
}
interface RegisteredSubject {
    type: Limitation;
    id?: number;
    ratelimits: SubjectRatelimit[];
}
interface Ratelimit {
    methods: Method[];
    pattern: dntShim.URLPattern;
    limitations: Limitation[];
    duration: number;
    count: number;
}
/**
 * Helper for OpenCloud ratelimit handling. This could also be used on other clients, but ratelimits are not public.
 */
export declare class RatelimitHelper {
    /**
     * Get a subject's global limitations.
     * @param subject - The target subject.
     */
    static getGlobalSubjectLimitations(subject?: RegisteredSubject): Limitation[];
    /**
     * Get a subject's individual limitations.
     * @param subject
     */
    static getIndividualSubjectLimitations(subject: RegisteredSubject): Limitation[];
    /**
     * The current subject ID.
     * @private
     */
    private _currentId;
    /**
     * A list of global and individual subjects with ratelimits.
     * @private
     */
    private _subjects;
    /**
     * The options given to the constructor.
     * @private
     */
    private readonly _options;
    /**
     * Construct a new RatelimitHelper instance.
     * @param options - The ratelimits to set.
     */
    constructor(options: Ratelimit[]);
    /**
     * Register a new subject.
     * @param type - The type of the subject.
     */
    registerSubject(type: RegisterIdentifierType): number;
    /**
     * De-register a registered subject by ID.
     * @param id - The target subject ID.
     */
    deregisterSubject(id: number): void;
    /**
     * Remove expired ratelimits in the instance.
     */
    removeExpiredRatelimits(): void;
    /**
     * List a subject's global and individual ratelimits, even if some are 0.
     * @param method - The HTTP method.
     * @param url - The HTTP url.
     * @param id - The target subject ID.
     */
    listSubjectRatelimits(method: Method, url: URL, id?: number): SubjectRatelimit[];
    /**
     * Increment all global and individual ratelimits for a subject ID by `count`.
     * @param method - The HTTP method.
     * @param url - The HTTP url.
     * @param id - The target subject ID.
     * @param count - The number to increment by.
     */
    incrementRatelimits(method: Method, url: URL, id?: number, count?: number): void;
    /**
     * Gets the request availability for a URL and method for a subject.
     * @param method - The HTTP method.
     * @param url - The HTTP url.
     * @param id - The target subject ID.
     */
    getRequestAvailability(method: Method, url: URL, id?: number): boolean;
    /**
     * Gets the date of the request availability for a URL and method for a subject.
     * @param method - The HTTP method.
     * @param url - The HTTP url.
     * @param id - The target subject ID.
     */
    getNextRequestAvailability(method: Method, url: URL, id?: number): Date | undefined;
}
export {};
