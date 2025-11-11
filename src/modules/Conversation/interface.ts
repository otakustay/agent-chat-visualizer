import {z} from 'zod';

const MessageSchema = z.object({user: z.string(), content: z.string()});
const MessageArraySchema = z.array(MessageSchema);
const MessageObjectSchema = z.object({messages: MessageArraySchema});
const ConversationSchema = z.union([MessageArraySchema, MessageObjectSchema]);

export type ConversationMessageItem = z.infer<typeof MessageSchema>;
export type ConversationData = z.infer<typeof ConversationSchema>;

export {ConversationSchema};
