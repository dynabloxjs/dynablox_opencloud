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

export class AssetUploadService extends BaseService {
	static urls = {
        upload: () => "{BEDEV2Url:assets-upload}/v1/upload"
	};

    public async upload(request: UploadRequest): Promise<unknown> {
        return (await this.rest.httpRequest<unknown>({
            method: "POST",
            url: AssetUploadService.urls.upload(),
            body: {
                type: "formdata",
                value: {
                    request: { value: new Blob([JSONv2.serialize(request.request)]) },
                    ContentType: { value: request.contentType },
                    ContentDeposition: { value: request.contentDeposition },
                    Length: { value: request.length },
                    Name: { value: request.name },
                    FileName: { value: request.fileName },
                }
            },
            includeCredentials: true,
        })).body;
    }
}
