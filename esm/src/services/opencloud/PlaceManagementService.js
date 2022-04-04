import { BaseService } from "../BaseService.js";
export class PlaceManagementService extends BaseService {
    async updatePlaceData(universeId, placeId, fileData, versionType = "Published") {
        return (await this.rest.httpRequest({
            method: "POST",
            url: PlaceManagementService.urls.updatePlaceData(universeId, placeId),
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
Object.defineProperty(PlaceManagementService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        updatePlaceData: (universeId, placeId) => `{BEDEV2Url:universes}/v1/${universeId}/places/${placeId}/versions`,
    }
});
