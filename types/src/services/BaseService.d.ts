import type { RESTController } from "../rest/RESTController.js";
/**
 * BaseService to be extended by all services.
 */
export declare abstract class BaseService {
    /**
     * The REST controller to use for requests.
     */
    protected rest: RESTController;
    /**
     * Construct a new BaseService with a RESTController and authenticationType.
     * @param rest - The RESTController
     */
    constructor(rest: RESTController);
}
