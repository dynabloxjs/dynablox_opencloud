import { RatelimitHelper } from "../helpers/RatelimitHelper.js";
import type { RESTController } from "../rest/RESTController.js";
/**
 * Get a new instance of a ratelimit helper for Open Cloud.
 * @param rest - The RESTController to use for formatting URLs.
 */
export declare function getOpenCloudRatelimitHelper(rest: RESTController): RatelimitHelper;
