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

    return (
        <div className="flex h-screen">
            <div className="w-[30%]">
                <Source onDataChange={setConversationData} />
            </div>
            <div className="w-[70%]">
                <Preview messages={getMessages()} />
            </div>
        </div>
    );
}
