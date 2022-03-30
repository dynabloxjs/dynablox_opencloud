import type { HTTPResponse } from "../rest/HTTPResponse.js";
declare type ChildError = {
    type: string;
    code: string;
};
export interface BEDEV2Error {
    code?: number | string;
    message: string;
    childErrors?: ChildError[];
}
export declare function parseBEDEV2Error(response: HTTPResponse<unknown>): Promise<BEDEV2Error[]>;
export {};
