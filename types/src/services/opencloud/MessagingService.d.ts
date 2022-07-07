import { BaseService } from "../BaseService.js";
export declare class MessagingService extends BaseService {
    static urls: {
        publishTopicMessage: (universeId: unknown, topicName: string) => string;
    };
    publishTopicMessage(universeId: number, topicName: string, data: unknown): Promise<void>;
}
