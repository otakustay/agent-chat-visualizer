import {
    Claude,
    OpenAI,
    Zhipu,
    Kimi,
    DeepSeek,
    OpenRouter,
} from '@lobehub/icons';

interface ModelIconProps {
    modelId: string;
    size?: number;
}

export default function ModelIcon({modelId, size = 20}: ModelIconProps) {
    const provider = modelId.split('/')[0];

    switch (provider) {
        case 'anthropic':
            return <Claude size={size} />;
        case 'openai':
            return <OpenAI size={size} />;
        case 'z-ai':
            return <Zhipu size={size} />;
        case 'moonshotai':
            return <Kimi size={size} />;
        case 'deepseek':
            return <DeepSeek size={size} />;
        default:
            return <OpenRouter size={size} />;
    }
}
