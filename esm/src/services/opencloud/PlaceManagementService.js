import { BaseService } from "../BaseService.js";
export class PlaceManagementService extends BaseService {
    async updatePlaceData(universeId, placeId, fileData, versionType = "Published") {
        return (await this.rest.httpRequest({
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
