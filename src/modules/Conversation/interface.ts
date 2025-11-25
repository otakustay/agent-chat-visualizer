import {z} from 'zod';

// 保留原始类型用于验证用户输入
const MessageSchema = z.object({role: z.enum(['system', 'assistant', 'user']), content: z.string()});
const MessageArraySchema = z.array(MessageSchema);
const MessageObjectSchema = z.object({messages: MessageArraySchema});
const ConversationSchema = z.union([MessageArraySchema, MessageObjectSchema]);

export type RawConversationMessageItem = z.infer<typeof MessageSchema>;
export type RawConversationData = z.infer<typeof ConversationSchema>;

// 简化系统内部类型
export interface ConversationMessageItem {
    role: 'system' | 'assistant' | 'user';
    content: string;
    id: string;
}

export type ConversationData = ConversationMessageItem[];

export {ConversationSchema};

export const enum ChangeType {
    Initial = 'Initial',
    EditContent = 'EditContent',
    GenerateByModel = 'GenerateByModel',
    Slice = 'Slice',
}

export interface SnapshotNode {
    id: string;
    timestamp: number;
    changeType: ChangeType;
    data: ConversationData;
    children: SnapshotNode[];
}
