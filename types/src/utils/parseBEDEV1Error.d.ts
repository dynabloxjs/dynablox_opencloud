import type { HTTPResponse } from "../rest/HTTPResponse.js";
export interface BEDEV1Error {
    code?: string | number;
    message: string;
    field?: string;
    fieldData?: string;
}
export declare function parseBEDEV1Error(response: HTTPResponse<unknown>): Promise<BEDEV1Error[]>;
