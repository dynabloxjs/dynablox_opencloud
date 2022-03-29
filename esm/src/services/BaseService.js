/**
 * BaseService to be extended by all services.
 */
export class BaseService {
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
