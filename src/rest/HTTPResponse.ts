import * as JSONv2 from "../utils/json.ts";
import { InternalHTTPRequest } from "./RESTController.ts";
import { camelizeObject } from "../utils/camelize.ts";

/**
 * Status of HTTP response.
 */
export interface HTTPResponseStatus {
	/**
	 * Whether the status code was 2xx.
	 */
	ok: boolean;
	/**
	 * Status code of the response.
	 */
	code: number;
	/**
	 * Status text of the response.
	 */
	text: string;
}

/**
 * A Dynablox HTTP Response.
 */
export class HTTPResponse<Expect = unknown> {
	/**
	 * Parse the response and request then return the parsed body.
	 * @param request - The request to use.
	 * @param response - The response to use.
	 */
	public static async parseBody<Expect>(
		request: InternalHTTPRequest,
		response: Response,
	): Promise<Expect> {
		let body: Expect = undefined as unknown as Expect;
		if (
			!(response.headers.get("content-type") === "0" ||
				response.status === 204) && request.expect !== "none"
		) {
			if (request.expect === "json" || !request.expect) {
				body = await (response.text().then((text) =>
					JSONv2.deserialize(text.trim())
				)) as unknown as Expect;

				// if BEDEV2
				if (
					request.camelizeResponse ??
						(!(request.url instanceof URL) &&
							(/^{BEDEV2Url:.*?}/).test(request.url))
				) {
					body = camelizeObject(body, {
						pascalCase: false,
						deep: true,
					});
				}
			} else {
				body = await (response[request.expect]()) as unknown as Expect;
			}
		}

		return body;
	}

	/**
	 * Parse the response and request then return the parsed body.
	 * @param request - The request to use.
	 * @param response - The response to use.
	 */
	public static async init<Expect>(
		request: InternalHTTPRequest,
		response: Response,
	): Promise<HTTPResponse<Expect>> {
		const responseClone = response.clone();
		const body = await this.parseBody<Expect>(request, responseClone);

		return new this<Expect>(request, response, body);
	}

	/**
	 * Status information.
	 */
	public readonly status: HTTPResponseStatus;
	/**
	 * Response headers.
	 */
	public readonly headers: Headers;
	/**
	 * Response body.
	 */
	public readonly body: Expect = undefined as unknown as Expect;
	/**
	 * Current request URL.
	 */
	public readonly url: string;
	/**
	 * Whether the request was redirected.
	 */
	public readonly redirected: boolean;
	/**
	 * Original response object.
	 */
	public readonly _response: Response;

	/**
	 * Original request object.
	 */
	public readonly _request: InternalHTTPRequest;

	/**
	 * Construct a new HTTP Response for Dynablox.
	 * @param request - The request to use.
	 * @param response - The response to use.
	 * @param body - The body to use.
	 */
	constructor(
		request: InternalHTTPRequest,
		response: Response,
		body?: Expect,
	) {
		this._response = response;
		this._request = request;

		this.status = {
			ok: response.ok,
			code: response.status,
			text: response.statusText,
		};
		this.headers = response.headers;
		if (body) {
			this.body = body;
		}
		this.url = response.url;
		this.redirected = response.redirected;
	}
}
