import { OpenCloudClientError } from "../../../clients/OpenCloudClient.ts";
import { type OpenCloudClient } from "../../../clients/OpenCloudClient.ts";

export enum PlaceVersionType {
	Saved = "Saved",
	Published = "Published",
}

/**
 * Base Place class for Open Cloud.
 */
export class BasePlace {
	/**
	 * The ID of the place.
	 */
	public readonly id: number;

	/**
	 * The parent universe ID of the place.
	 */
	public readonly parentUniverseId: number | undefined;

	/**
	 * The client to use services from.
	 * @private
	 */
	private readonly _client: OpenCloudClient;

	/**
	 * Construct a new Base Place with its place ID and parent universe ID.
	 * @param client - The base client to use services from.
	 * @param id - The place ID.
	 * @param parentUniverseId - The parent universe id.
	 */
	constructor(
		client: OpenCloudClient,
		id: number,
		parentUniverseId?: number,
	) {
		this._client = client;
		this.id = id;
		this.parentUniverseId = parentUniverseId;
	}

	/**
	 * Update the contents for a place. This will create a new Place version, and the version will be `Published` if `placeVersionType` is `Published`.
	 * @param data
	 * @param placeVersionType
	 */
	public async updateContents(
		data: Uint8Array,
		placeVersionType: keyof typeof PlaceVersionType = "Saved",
	): Promise<number> {
		if (!this.parentUniverseId) {
			throw new OpenCloudClientError(
				"Can not use `updatePlaceData` on a place with no parentUniverseId.",
			);
		}

		this._client.canAccessResource(
			"universe-places",
			[this.parentUniverseId.toString()],
			"write",
			[false],
		);

		if (data.length > 10_000_000) {
			throw new OpenCloudClientError(
				`data execeeds the maximum allowed 100MB (${data.length.toLocaleString()}).`,
			);
		}

		return (await this._client.services.opencloud.PlaceManagementService
			.updatePlaceData(
				this.parentUniverseId,
				this.id,
				data,
				placeVersionType,
			)).versionNumber;
	}
}
