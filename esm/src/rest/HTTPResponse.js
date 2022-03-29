import * as JSONv2 from "../utils/json.js";
import { camelizeObject } from "../utils/camelize.js";
/**
 * A Dynablox HTTP Response.
 */
export class HTTPResponse {
    /**
     * Construct a new HTTP Response for Dynablox.
     * @param request - The request to use.
     * @param response - The response to use.
     * @param body - The body to use.
     */
    constructor(request, response, body) {
        /**
         * Status information.
         */
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Response headers.
         */
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Response body.
         */
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * Current request URL.
         */
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Whether the request was redirected.
         */
        Object.defineProperty(this, "redirected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Original response object.
         */
        Object.defineProperty(this, "_response", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Original request object.
         */
        Object.defineProperty(this, "_request", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._response = response;
        this._request = request;
        this.status = {
            ok: response.ok,
            code: response.status,
            text: response.statusText,
        };
        this.headers = response.headers;
        if (body) {
            this.body = body;
        }
        this.url = response.url;
        this.redirected = response.redirected;
    }
    /**
     * Parse the response and request then return the parsed body.
     * @param request - The request to use.
     * @param response - The response to use.
     */
    static async parseBody(request, response) {
        let body = undefined;
        if (!(response.headers.get("content-type") === "0" ||
            response.status === 204) && request.expect !== "none") {
            if (request.expect === "json" || !request.expect) {
                body = await (response.text().then((text) => JSONv2.deserialize(text.trim())));
                // if BEDEV2
                if (request.camelizeResponse ??
                    (!(request.url instanceof URL) &&
                        (/^{BEDEV2Url:.*?}/).test(request.url))) {
                    body = camelizeObject(body, {
                        pascalCase: false,
                        deep: true,
                    });
                }
            }
            else {
                body = await (response[request.expect]());
            }
        }
        return body;
    }
    /**
     * Parse the response and request then return the parsed body.
     * @param request - The request to use.
     * @param response - The response to use.
     */
    static async init(request, response) {
        const responseClone = response.clone();
        const body = await this.parseBody(request, responseClone);
        return new this(request, response, body);
    }
}
