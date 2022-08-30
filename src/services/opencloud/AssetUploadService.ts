import { BaseService } from "../BaseService.ts";
import * as JSONv2 from "../../utils/json.ts";

/*
TODO: Verify typings.
*/

export interface UploadRequest {
	request: unknown;
	contentType: string;
	contentDeposition: string;
	length: string;
	name: string;
	fileName: string;
}

export interface UploadResponse {
	statusUrl: string | null;
}

export interface CompleteMultipartUploadResponse {
	operationId: string;
	statusUrl: string | null;
}

export interface AssetCreationInfo {
	assetId: number;
	assetVersionNumber: number;
}

export interface AssetCreationResult {
	assetInfo: AssetCreationInfo;
}

export interface UploadStatus {
	status: number;
	result: AssetCreationResult | null;
}

export interface AssetUploadContext {
	assetId: number;
	assetName: string;
	assetDescription: string | null;
	creatorType: number;
	creatorId: number;
}

export interface StartMultipartUploadRequest {
	targetType: string;
	file: unknown;
	assetUploadContext: AssetUploadContext;
}

export interface MultipartUploadUrl {
	httpVerb?: string;
	url?: string;
	expirationTime?: string;
	chunkNum?: number;
	contentStart?: number;
	contentLength?: number;
}

export interface StartMultipartUploadResponse {
	operationId: string;
	uploadUrls: MultipartUploadUrl[] | null;
}

export interface CompleteMultipartUploadChunkRequest {
	operationId: string;
	chunkNum: number;
	eTag: string;
}

export class AssetUploadService extends BaseService {
	static urls = {
		upload: () => "{BEDEV2Url:assets-upload}/v1/upload",
		getUploadStatus: (operationId: string) =>
			`{BEDEV2Url:assets-upload}/v1/status/${operationId}`,
		startMultipartUpload: () =>
			"{BEDEV2Url:assets-upload}/v1/multipart-upload/start",
		abortMultipartUpload: (operationId: string) =>
			`{BEDEV2Url:assets-upload}/v1/multipart-upload/${operationId}/abort`,
		completeMultipartUploadChunk: () =>
			"{BEDEV2Url:assets-upload}/v1/multipart-upload/chunk-complete",
		completeMultipartUpload: (operationId: string) =>
			`{BEDEV2Url:assets-upload}/v1/multipart-upload/${operationId}/complete`,
	};

	public async upload(request: UploadRequest): Promise<UploadResponse> {
		return (await this.rest.httpRequest<UploadResponse>({
			method: "POST",
			url: AssetUploadService.urls.upload(),
			body: {
				type: "formdata",
				value: {
					request: {
						value: new Blob([JSONv2.serialize(request.request)]),
					},
					ContentType: { value: request.contentType },
					ContentDeposition: { value: request.contentDeposition },
					Length: { value: request.length },
					Name: { value: request.name },
					FileName: { value: request.fileName },
				},
			},
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async getUploadStatus(operationId: string): Promise<UploadStatus> {
		return (await this.rest.httpRequest<UploadStatus>({
			url: AssetUploadService.urls.getUploadStatus(operationId),
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async startMultipartUpload(
		request: StartMultipartUploadRequest,
	): Promise<StartMultipartUploadResponse> {
		return (await this.rest.httpRequest<StartMultipartUploadResponse>({
			method: "POST",
			url: AssetUploadService.urls.startMultipartUpload(),
			body: {
				type: "json",
				value: request,
			},
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

	public async abortMultipartUpload(operationId: string): Promise<void> {
		await this.rest.httpRequest<void>({
			method: "DELETE",
			url: AssetUploadService.urls.abortMultipartUpload(operationId),
			expect: "none",
			errorHandling: "BEDEV2",
			includeCredentials: true,
		});
	}

	public async completeMultipartUploadChunk(
		request: CompleteMultipartUploadChunkRequest,
	): Promise<void> {
		await this.rest.httpRequest<void>({
			method: "POST",
			url: AssetUploadService.urls.completeMultipartUploadChunk(),
			body: {
				type: "json",
				value: request,
			},
			expect: "none",
			errorHandling: "BEDEV2",
			includeCredentials: true,
		});
	}

	public async completeMultipartUpload(
		operationId: string,
	): Promise<CompleteMultipartUploadResponse> {
		return (await this.rest.httpRequest<CompleteMultipartUploadResponse>({
			method: "DELETE",
			url: AssetUploadService.urls.completeMultipartUpload(operationId),
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}

}
