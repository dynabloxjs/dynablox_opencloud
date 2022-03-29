"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPResponse = void 0;
const JSONv2 = __importStar(require("../utils/json.js"));
const camelize_js_1 = require("../utils/camelize.js");
/**
 * A Dynablox HTTP Response.
 */
class HTTPResponse {
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
                    body = (0, camelize_js_1.camelizeObject)(body, {
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
exports.HTTPResponse = HTTPResponse;
