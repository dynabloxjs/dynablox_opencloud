import { BaseService } from "../BaseService.ts";

export interface UpdatePlaceDataResponse {
	versionNumber: number;
}

type UpdatePlaceDataVersionType = "Saved" | "Published";

export class PlaceManagementService extends BaseService {
	public async updatePlaceData(
		universeId: number,
		placeId: number,
		fileData: Uint8Array,
		versionType: UpdatePlaceDataVersionType = "Published",
	): Promise<UpdatePlaceDataResponse> {
		return (await this.rest.httpRequest<UpdatePlaceDataResponse>({
			method: "POST",
			url: `{BEDEV2Url:universes}/v1/${universeId}/places/${placeId}/versions`,
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
}
