import * as JSONv2 from "../utils/json.ts";
import { MIMEType } from "../../deps.ts";
import type { HTTPResponse } from "../rest/HTTPResponse.ts";

type BEDEV1ErrorResponse = string | {
	errors: {
		code: number;
		message: string;
		userFacingMessage?: string;
		field?: string;
		fieldData?: string;
		retryable?: boolean;
	}[];
} | {
	code: string | number;
	message: string;
};

export interface BEDEV1Error {
	code?: string | number;
	message: string;
	field?: string;
	fieldData?: string;
}

export async function parseBEDEV1Error(
	response: HTTPResponse<unknown>,
): Promise<BEDEV1Error[]> {
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
			if (responseType.isHTML()) {
				// We are not going to parse from HTML.
				return [{
					message: "<HTML-formatted Error>",
				}];
			} else if (
				(responseType.type === "text" ||
					responseType.type === "application") &&
				(responseType.subtype === "json" ||
					responseType.subtype.endsWith("+json"))
			) {
				// Content type is json, parse.
				const json = await response._response.text().then((text) =>
					JSONv2.deserialize(text.trim())
				) as BEDEV1ErrorResponse;
				if (typeof json === "string") {
					// in some context, it can be a stinrg
					return [{
						message: json,
					}];
				} else if ("code" in json) {
					return [{
						code: json?.code ?? undefined,
						message: json?.message,
					}];
				} else {
					return json?.errors ?? [];
				}
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
