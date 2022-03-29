import * as JSONv2 from "../utils/json.ts";
import { MIMEType } from "../../deps.ts";
import type { HTTPResponse } from "../rest/HTTPResponse.ts";

type BEDEV2ErrorResponse = string | string[] | {
	errors?: {
		code?: number | string;
		message?: string;
	}[] | Record<string, string[]>;
} | {
	error?: string;
	error_description?: string;
} | {
	//
	code?: number | string;
	message?: string;
} | {
	error?: string;
	code?: number;
	message?: string;
} | {
	errorCode?: number;
	message?: string;
} | {
	//
	Error?: {
		Code?: number;
		Message?: string;
	};
} | {
	error: string;
	message: string;
	errorDetails: {errorDetailType: string; datastoreErrorCode: string; }[];
}

export interface BEDEV2Error {
	code?: number | string;
	message: string;
}

export async function parseBEDEV2Error(
	response: HTTPResponse<unknown>,
): Promise<BEDEV2Error[]> {
	const contentLength = response.headers.has("content-length")
		? parseInt(response.headers.get("content-length")!)
		: 0;
	if (contentLength === 0) {
		return [];
	}
	if (response.headers.has("content-type")) {
		const responseType = MIMEType.parse(
			response.headers.get("content-type")!,
		);
		if (responseType) {
			if (
				(responseType.type === "text" ||
					responseType.type === "application") &&
				(responseType.subtype === "json" ||
					responseType.subtype.endsWith("+json"))
			) {
				// Content type is json, parse.
				const json = await response._response.text().then((text) =>
					JSONv2.deserialize(text.trim())
				) as BEDEV2ErrorResponse;

				if (typeof json === "string") {
					// in some contextes, it can be a stinrg
					return [{
						message: json,
					}];
				} else if (Array.isArray(json)) {
					return json.map((errorMessage) => {
						return {
							message: errorMessage,
						};
					});
				} else {
					if ("errors" in json) {
						if (json.errors instanceof Array) {
							return json.errors.map((error) => {
								return {
									code: error.code,
									message: error.message ?? "???",
								};
							});
						} else {
							return Object.entries(
								(json.errors) as Record<string, string[]>,
							).map(([index, value]) => {
								return {
									message: `${index}(${value.join(", ")})`,
								};
							});
						}
					}
					if ("error" in json) {
						if ("code" in json) {
							return [{
								code: json.code,
								message: (json.error as string),
							}];
						} else if ("error_description" in json) {
							return [{
								code: json.error,
								message: json.error_description!,
							}];
						} else if ("message" in json) {
							return [{
								code: json.error,
								message: json.message!,
							}].concat("errorDetails" in json ? json.errorDetails.map(error => {
								return {
									code: error.datastoreErrorCode,
									message: error.errorDetailType,
								}
							}) : []);
						}
					}

					if ("message" in json) {
						if ("errorCode" in json) {
							return [{
								code: json.errorCode,
								message: (json.message as string),
							}];
						} else if ("code" in json) {
							return [{
								code: json.code,
								message: (json.message as string),
							}];
						}
					}

					if ("Error" in json) {
						if (
							("Code" in json.Error!) &&
							("Message" in json.Error!)
						) {
							return [{
								code: json.Error.Code,
								message: json.Error.Message!,
							}];
						}
					}

					return [{
						message: "Unknown Error",
					}];
				}
			} else if (responseType.type === "text") {
				return [{
					message: await response._response.text(),
				}];
			} else {
				return [{
					message: `<(${responseType?.type ?? "unknown"}/${
						responseType?.subtype ?? "unknown"
					})-formatted Error>`,
				}];
			}
		} else {
			return [{
				message: await response._response.text(),
			}];
		}
	} else {
		// Send error with text because we don't have content-type
		return [
			{
				message: await response._response.text(),
			},
		];
	}
}
