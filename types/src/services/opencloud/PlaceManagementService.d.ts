import { BaseService } from "../BaseService.js";
export interface UpdatePlaceDataResponse {
    versionNumber: number;
}
export interface GetPlaceUniverseIdResponse {
    universeId: number | null;
}
export declare type UpdatePlaceDataVersionType = "Saved" | "Published";
export declare class PlaceManagementService extends BaseService {
    static urls: {
        updatePlaceData: (universeId: unknown, placeId: unknown) => string;
        getPlaceUniverseId: (placeId: number) => string;
    };
    updatePlaceData(universeId: number, placeId: number, fileData: Uint8Array, versionType?: UpdatePlaceDataVersionType): Promise<UpdatePlaceDataResponse>;
    getPlaceUniverseId(placeId: number): Promise<GetPlaceUniverseIdResponse>;
}
