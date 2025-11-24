export interface ModelItem {
    id: string;
    name: string;
}

export const AVAILABLE_MODELS: ModelItem[] = [
    {id: 'anthropic/claude-sonnet-4.5', name: 'Sonnet 4.5'},
    {id: 'anthropic/claude-haiku-4.5', name: 'Haiku 4.5'},
    {id: 'openai/gpt-5', name: 'GPT-5'},
    {id: 'z-ai/glm-4.6', name: 'GLM-4.6'},
    {id: 'moonshotai/kimi-k2-0905', name: 'K2'},
    {id: 'deepseek/deepseek-v3.1-terminus', name: 'DeepSeek 3.1'},
];

export function getModelNameById(id: string): string {
    const model = AVAILABLE_MODELS.find(m => m.id === id);

    if (!model) {
        throw new Error(`Model with id "${id}" not found`);
    }

    return model.name;
}
