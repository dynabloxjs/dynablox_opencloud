import type { HTTPResponse } from "../rest/HTTPResponse.js";
export interface BEDEV2Error {
    code?: number | string;
    message: string;
}
export declare function parseBEDEV2Error(response: HTTPResponse<unknown>): Promise<BEDEV2Error[]>;
