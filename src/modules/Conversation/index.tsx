import {useState} from 'react';
import Source from './Source';
import Preview from './Preview';
import type {ConversationData, ConversationMessageItem} from './interface';

export default function ConversationModule() {
    const [conversationData, setConversationData] = useState<ConversationData | null>(null);

    const getMessages = (): ConversationMessageItem[] => {
        if (!conversationData) {
            return [];
        }

        if (Array.isArray(conversationData)) {
            return conversationData;
        }

        return conversationData.messages;
    };

    const updateMessage = (index: number, newContent: string) => {
        if (!conversationData) {
            return;
        }

        const updatedMessages = [...getMessages()];
        updatedMessages[index] = {
            ...updatedMessages[index],
            content: newContent,
        };

        const updatedData = Array.isArray(conversationData)
            ? updatedMessages
            : {...conversationData, messages: updatedMessages};

        setConversationData(updatedData);
    };

    return (
        <div className="flex h-screen">
            <div className="w-[30%]">
                <Source data={conversationData} onDataChange={setConversationData} />
            </div>
            <div className="w-[70%]">
                <Preview messages={getMessages()} onEditMessage={updateMessage} />
            </div>
        </div>
    );
}
