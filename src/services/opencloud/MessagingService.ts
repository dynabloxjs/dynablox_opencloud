import { BaseService } from "../BaseService.ts";
import * as JSONv2 from "../../utils/json.ts";

export class DataStoreService extends BaseService {
	static urls = {
		publishTopicMessage: (universeId: unknown, topicName: string) =>
			`{BEDEV2Url:messaging-service}/v1/universes/${universeId}/topics/${topicName}`,
	};

	public async publishTopicMessage(
		universeId: number,
        topicName: string,
        data: unknown,
	): Promise<void> {
		return (await this.rest.httpRequest<void>({
            method: "POST",
			url: DataStoreService.urls.publishTopicMessage(universeId, topicName),
            body: {
                type: "json",
                value: {
                    data,
                }
            },
            expect: "none",
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}
}
