import {useState} from 'react';
import {Streamdown, defaultRehypePlugins, defaultRemarkPlugins} from 'streamdown';
import remarkBreaks from 'remark-breaks';
import type {ConversationMessageItem} from '../interface';

const REMARK_PLUGINS = [...Object.values(defaultRemarkPlugins), remarkBreaks];
const REHYPE_PLUGINS = Object
    .entries(defaultRehypePlugins)
    .filter(([key]) => key !== 'raw')
    .map(([, plugin]) => plugin);

interface MessageItemProps {
    message: ConversationMessageItem;
}

function MessageItem({message}: MessageItemProps) {
    const {role, content} = message;
    const [isExpanded, setIsExpanded] = useState(false);

    const getMessageStyles = () => {
        switch (role) {
            case 'system':
                return {
                    container: 'bg-gray-50 mx-0', // ??????
                    wrapper: '',
                };
            case 'user':
                return {
                    container: 'bg-blue-50 ml-0 mr-8', // ?????
                    wrapper: '',
                };
            case 'assistant':
                return {
                    container: 'bg-green-50 ml-8 mr-0', // ?????
                    wrapper: '',
                };
            default:
                return {
                    container: 'bg-gray-50 mx-0',
                    wrapper: '',
                };
        }
    };

    const styles = getMessageStyles();

    const renderContent = () => (
        <Streamdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
            {content}
        </Streamdown>
    );

    return (
        <div className={`rounded-lg p-4 mb-4 ${styles.container}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 font-medium uppercase">
                    {role}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            <div
                className={`text-black text-xs ${isExpanded ? '' : 'max-h-32 overflow-hidden'}`}
            >
                {renderContent()}
            </div>
        </div>
    );
}

interface PreviewProps {
    messages?: ConversationMessageItem[];
}
export default function Preview({messages = []}: PreviewProps) {
    const renderMessageItem = (message: ConversationMessageItem, index: number) => (
        <MessageItem key={index} message={message} />
    );

    const renderContent = () => {
        if (messages.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <p>No messages to display. Paste JSON data in the Source panel to see the preview.</p>
                </div>
            );
        }

        return <div className="space-y-0">{messages.map(renderMessageItem)}</div>;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-gray-300 p-4">
                <h2 className="text-lg font-semibold">Preview</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
                {renderContent()}
            </div>
        </div>
    );
}
