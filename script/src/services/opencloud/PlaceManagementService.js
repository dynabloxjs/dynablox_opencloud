"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceManagementService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class PlaceManagementService extends BaseService_js_1.BaseService {
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
exports.PlaceManagementService = PlaceManagementService;
Object.defineProperty(PlaceManagementService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        updatePlaceData: (universeId, placeId) => `{BEDEV2Url:universes}/v1/${universeId}/places/${placeId}/versions`,
    }
});
