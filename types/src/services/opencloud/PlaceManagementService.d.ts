import { BaseService } from "../BaseService.js";
export interface UpdatePlaceDataResponse {
    versionNumber: number;
}
declare type UpdatePlaceDataVersionType = "Saved" | "Published";
export declare class PlaceManagementService extends BaseService {
    updatePlaceData(universeId: number, placeId: number, fileData: Uint8Array, versionType?: UpdatePlaceDataVersionType): Promise<UpdatePlaceDataResponse>;
}
export {};
