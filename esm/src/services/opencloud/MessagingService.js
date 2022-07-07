import { BaseService } from "../BaseService.js";
export class MessagingService extends BaseService {
    async publishTopicMessage(universeId, topicName, data) {
        return (await this.rest.httpRequest({
            method: "POST",
            url: MessagingService.urls.publishTopicMessage(universeId, topicName),
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
Object.defineProperty(MessagingService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        publishTopicMessage: (universeId, topicName) => `{BEDEV2Url:messaging-service}/v1/universes/${universeId}/topics/${topicName}`,
    }
});
