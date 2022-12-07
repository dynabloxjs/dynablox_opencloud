import * as JSONv2 from "../../utils/json.ts";
import { BaseService } from "../BaseService.ts";

export interface UploadRequest {
	request: UploadRequestRequest;
	fileContent: Uint8Array;
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

export type OperationErrorCode =
	| "Invalid"
	| "CorruptedData"
	| "ContentModerated";

export interface OperationError {
	errorCode: OperationErrorCode;
	errorMessage: string;
}

export interface PublicError {
	errors: OperationError[];
}

export type OperationStatus = "Invalid" | "Failed" | "Pending" | "Success";

export interface UploadStatus {
	status: OperationStatus;
	result: AssetCreationResult | null;
	publicError: PublicError | null;
}

export type CreatorType = "Invalid" | "User" | "Group";

export type CreationContextCreator = {
	creatorType: CreatorType;
	creatorId: number;
};

export interface CreationContext {
	assetId?: number;
	assetName: string;
	assetDescription?: string;
	creator: CreationContextCreator;
}

export type AssetCreationTargetType =
	| "Unknown"
	| "Audio"
	| "Decal"
	| "ModelFromFbx"
	| "AnimationFromVideo"
	| "Image"
	| "TexturePack"
	| "EmoteAnimation"
	| "AnimationFromFbx"
	| "Tshirt"
	| "Shirt"
	| "Pants";

export interface MultipartUploadFile {
	filesize: number;
	md5Checksum: string;
	chunkPlan: number[];
}

export interface StartMultipartUploadRequest {
	targetType: AssetCreationTargetType;
	file: MultipartUploadFile;
	creationContext: CreationContext;
}

export interface UploadRequestRequest {
	targetType: AssetCreationTargetType;
	creationContext: CreationContext;
}

export interface MultipartUploadUrl {
	httpVerb: string;
	url: string;
	expirationTime: string;
	chunkNum: number;
	contentStart: number;
	contentLength: number;
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
		upload: () => "{BEDEV2Url:assets}/v1/create",
		getUploadStatus: (operationId: string) =>
			`{BEDEV2Url:assets}/v1/create/status/${operationId}`,
		startMultipartUpload: () =>
			"{BEDEV2Url:assets}/v1/multipart-upload/start",
		abortMultipartUpload: (operationId: string) =>
			`{BEDEV2Url:assets}/v1/multipart-upload/${operationId}/abort`,
		completeMultipartUploadChunk: () =>
			"{BEDEV2Url:assets}/v1/multipart-upload/chunk-complete",
		completeMultipartUpload: (operationId: string) =>
			`{BEDEV2Url:assets}/v1/multipart-upload/${operationId}/complete`,
	};

	public async upload(request: UploadRequest): Promise<UploadResponse> {
		return (await this.rest.httpRequest<UploadResponse>({
			method: "POST",
			url: AssetUploadService.urls.upload(),
			body: {
				type: "formdata",
				value: {
					request: { value: JSONv2.serialize(request.request) },
					fileContent: { value: new Blob([request.fileContent]) },
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
			method: "POST",
			url: AssetUploadService.urls.completeMultipartUpload(operationId),
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}
}
