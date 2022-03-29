import * as dntShim from "../../_dnt.shims.js";
import { InternalHTTPRequest } from "./RESTController.js";
/**
 * Status of HTTP response.
 */
export interface HTTPResponseStatus {
    /**
     * Whether the status code was 2xx.
     */
    ok: boolean;
    /**
     * Status code of the response.
     */
    code: number;
    /**
     * Status text of the response.
     */
    text: string;
}
/**
 * A Dynablox HTTP Response.
 */
export declare class HTTPResponse<Expect = unknown> {
    /**
     * Parse the response and request then return the parsed body.
     * @param request - The request to use.
     * @param response - The response to use.
     */
    static parseBody<Expect>(request: InternalHTTPRequest, response: dntShim.Response): Promise<Expect>;
    /**
     * Parse the response and request then return the parsed body.
     * @param request - The request to use.
     * @param response - The response to use.
     */
    static init<Expect>(request: InternalHTTPRequest, response: dntShim.Response): Promise<HTTPResponse<Expect>>;
    /**
     * Status information.
     */
    readonly status: HTTPResponseStatus;
    /**
     * Response headers.
     */
    readonly headers: dntShim.Headers;
    /**
     * Response body.
     */
    readonly body: Expect;
    /**
     * Current request URL.
     */
    readonly url: string;
    /**
     * Whether the request was redirected.
     */
    readonly redirected: boolean;
    /**
     * Original response object.
     */
    readonly _response: dntShim.Response;
    /**
     * Original request object.
     */
    readonly _request: InternalHTTPRequest;
    /**
     * Construct a new HTTP Response for Dynablox.
     * @param request - The request to use.
     * @param response - The response to use.
     * @param body - The body to use.
     */
    constructor(request: InternalHTTPRequest, response: dntShim.Response, body?: Expect);
}
