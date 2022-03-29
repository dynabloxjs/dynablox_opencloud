"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
/**
 * BaseService to be extended by all services.
 */
class BaseService {
    /**
     * Construct a new BaseService with a RESTController and authenticationType.
     * @param rest - The RESTController
     */
    constructor(rest) {
        /**
         * The REST controller to use for requests.
         */
        Object.defineProperty(this, "rest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.rest = rest;
    }
}
exports.BaseService = BaseService;
