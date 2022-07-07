import { BaseService } from "../BaseService.ts";

export class MessagingService extends BaseService {
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
			url: MessagingService.urls.publishTopicMessage(
				universeId,
				topicName,
			),
			body: {
				type: "json",
				value: {
					message: data,
				},
			},
			expect: "none",
			errorHandling: "BEDEV2",
			includeCredentials: true,
		})).body;
	}
}
