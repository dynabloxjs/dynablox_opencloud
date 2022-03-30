import type { HTTPResponse } from "../rest/HTTPResponse.js";
declare type ChildError = {
    type: string;
    code: string;
};
export interface BEDEV1Error {
    code?: string | number;
    message: string;
    childErrors?: ChildError[];
    field?: string;
    fieldData?: string;
}
export declare function parseBEDEV1Error(response: HTTPResponse<unknown>): Promise<BEDEV1Error[]>;
export {};
