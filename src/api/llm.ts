import type {ConversationMessageItem} from '@/modules/Conversation/interface';
import {ValidationError} from '@/utils/error';
import {post} from './request';

interface OpenRouterChoice {
    message: {
        role: string;
        content: string;
    };
    finish_reason: string;
    index: number;
}

interface OpenRouterResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: OpenRouterChoice[];
}

export interface GenerateTextRequest {
    apiKey: string;
    modelId: string;
    messages: ConversationMessageItem[];
}

interface GenerateTextBody {
    model: string;
    messages: ConversationMessageItem[];
}

const validateGenerateTextRequest = (request: GenerateTextRequest): void => {
    if (!request.apiKey.trim()) {
        throw new ValidationError('Please enter your OpenRouter API Key');
    }

    if (!request.modelId.trim()) {
        throw new ValidationError('Please enter a model name');
    }

    if (!request.messages || request.messages.length === 0) {
        throw new ValidationError('Please provide at least one message');
    }
};

export const llmApi = {
    generateText: async (request: GenerateTextRequest): Promise<string> => {
        validateGenerateTextRequest(request);

        const response = await post<GenerateTextBody, OpenRouterResponse>(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                body: {
                    model: request.modelId,
                    messages: request.messages,
                },
                headers: {
                    Authorization: `Bearer ${request.apiKey}`,
                },
            }
        );

        const content = response.choices.at(0)?.message?.content;

        if (!content) {
            throw new Error('Invalid response format from API: missing choice content');
        }

        return content;
    },
};
