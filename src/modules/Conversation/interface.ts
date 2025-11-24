import {z} from 'zod';

const MessageSchema = z.object({role: z.enum(['system', 'assistant', 'user']), content: z.string()});
const MessageArraySchema = z.array(MessageSchema);
const MessageObjectSchema = z.object({messages: MessageArraySchema});
const ConversationSchema = z.union([MessageArraySchema, MessageObjectSchema]);

export type ConversationMessageItem = z.infer<typeof MessageSchema>;
export type ConversationData = z.infer<typeof ConversationSchema>;

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
