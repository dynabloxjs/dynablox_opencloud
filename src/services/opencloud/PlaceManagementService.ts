import { BaseService } from "../BaseService.ts";

export interface UpdatePlaceDataResponse {
	versionNumber: number;
}

export interface GetPlaceUniverseIdResponse {
	universeId: number | null;
}

export type UpdatePlaceDataVersionType = "Saved" | "Published";

export class PlaceManagementService extends BaseService {
	public static urls = {
		updatePlaceData: (universeId: unknown, placeId: unknown) =>
			`{BEDEV2Url:universes}/v1/${universeId}/places/${placeId}/versions`,
		getPlaceUniverseId: (placeId: number) =>
			`{BEDEV2Url:universes}/v1/places/${placeId}/universe`,
	};

	public async updatePlaceData(
		universeId: number,
		placeId: number,
		fileData: Uint8Array,
		versionType: UpdatePlaceDataVersionType = "Published",
	): Promise<UpdatePlaceDataResponse> {
		return (await this.rest.httpRequest<UpdatePlaceDataResponse>({
			method: "POST",
			url: PlaceManagementService.urls.updatePlaceData(
				universeId,
				placeId,
			),
			query: {
				versionType,
			},
			body: {
				type: "file",
				value: fileData,
			},
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async getPlaceUniverseId(
		placeId: number,
	): Promise<GetPlaceUniverseIdResponse> {
		return (await this.rest.httpRequest<GetPlaceUniverseIdResponse>({
			url: PlaceManagementService.urls.getPlaceUniverseId(
				placeId,
			),
			errorHandling: "BEDEV2",
		})).body;
	}
}
