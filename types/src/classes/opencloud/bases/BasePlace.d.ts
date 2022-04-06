import { type OpenCloudClient } from "../../../clients/OpenCloudClient.js";
import { type UpdatePlaceDataVersionType } from "../../../services/opencloud/PlaceManagementService.js";
/**
 * Base Place class for Open Cloud.
 */
export declare class BasePlace {
    /**
     * The ID of the place.
     */
    readonly id: number;
    /**
     * The parent universe ID of the place.
     */
    readonly parentUniverseId: number | undefined;
    /**
     * The client to use services from.
     * @private
     */
    private readonly _client;
    /**
     * Construct a new Base Place with its place ID and parent universe ID.
     * @param client - The base client to use services from.
     * @param id - The place ID.
     * @param parentUniverseId - The parent universe id.
     */
    constructor(client: OpenCloudClient, id: number, parentUniverseId?: number);
    /**
     * Update the contents for a place. This will create a new Place version, and the version will be `Published` if `placeVersionType` is `Published`.
     * @param data
     * @param placeVersionType
     */
    updateContents(data: Uint8Array, placeVersionType?: UpdatePlaceDataVersionType): Promise<number>;
}
