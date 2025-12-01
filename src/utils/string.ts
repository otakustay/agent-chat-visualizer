import {pascalCase} from 'case-anything';

export function generateRandomId(): string {
    return Math.random().toString(36).slice(2, 11);
}

export function formatToTimeString(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

export function extractFirstXmlTag(content: string): string | null {
    const regex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/;
    const match = content.match(regex);
    return match ? match[1] : null;
}

export function toPascalCase(str: string): string {
    return pascalCase(str);
}

export function detectUserMessageType(content: string): string | null {
    return content.includes('tool_result') ? 'ToolResult' : null;
}
