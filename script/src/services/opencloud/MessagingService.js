"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const BaseService_js_1 = require("../BaseService.js");
class MessagingService extends BaseService_js_1.BaseService {
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
exports.MessagingService = MessagingService;
Object.defineProperty(MessagingService, "urls", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        publishTopicMessage: (universeId, topicName) => `{BEDEV2Url:messaging-service}/v1/universes/${universeId}/topics/${topicName}`,
    }
});
