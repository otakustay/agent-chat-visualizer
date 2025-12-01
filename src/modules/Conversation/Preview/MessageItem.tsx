import {useState} from 'react';
import {Element} from 'react-scroll';
import {Waypoint} from 'react-waypoint';
import {FiChevronDown, FiChevronRight} from 'react-icons/fi';
import type {ConversationMessageItem} from '../interface';
import {preprocessXmlToCodeBlock} from '../utils/string';
import {useMessageCollapsed, useToggleMessageCollapse} from '@/atoms/conversation';
import {detectUserMessageType, extractFirstXmlTag, toPascalCase} from '@/utils/string';
import MarkdownContent from './MarkdownContent';
import MarkdownEditor from './MarkdownEditor';
import MessageOperations from './MessageOperations';

const getMessageStyles = (role: string) => {
    switch (role) {
        case 'system':
            return {
                container: 'bg-gray-50 mx-0',
                wrapper: '',
            };
        case 'user':
            return {
                container: 'bg-blue-50 ml-0 mr-8',
                wrapper: '',
            };
        case 'assistant':
            return {
                container: 'bg-green-50 ml-8 mr-0',
                wrapper: '',
            };
        default:
            return {
                container: 'bg-gray-50 mx-0',
                wrapper: '',
            };
    }
};

interface MessageItemProps {
    message: ConversationMessageItem;
    index: number;
    onEnter: (index: number) => void;
    onCopyAsMarkdown: (messageId: string) => void;
    onCopyToThis: (messageId: string) => void;
    onEditMessage: (messageId: string, newContent: string) => void;
    onSliceToThis: (messageId: string) => void;
    onCollapseAllAbove: (messageId: string) => void;
}

export default function MessageItem(props: MessageItemProps) {
    const {message, index, onEnter, onCopyAsMarkdown, onCopyToThis, onEditMessage, onSliceToThis, onCollapseAllAbove} =
        props;
    const {role, content, id, model} = message;
    const [isEditing, setIsEditing] = useState(false);
    const styles = getMessageStyles(role);
    const isCollapsed = useMessageCollapsed(id);
    const toggleCollapse = useToggleMessageCollapse();

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (newContent: string) => {
        onEditMessage(message.id, newContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderContent = () => {
        if (isCollapsed) {
            let displayText = '';

            if (role === 'user') {
                const userType = detectUserMessageType(content);
                displayText = userType ? `${userType} (${content.length} characters)` : `${content.length} characters`;
            }
            else if (role === 'assistant') {
                const firstTag = extractFirstXmlTag(content);
                if (firstTag) {
                    const tagDisplayName = toPascalCase(firstTag);
                    displayText = `${tagDisplayName} (${content.length} characters)`;
                }
                else {
                    displayText = `${content.length} characters`;
                }
            }
            else {
                displayText = `${content.length} characters`;
            }

            return (
                <div className="text-gray-500 text-xs italic">
                    {displayText}
                </div>
            );
        }
        const processedContent = preprocessXmlToCodeBlock(content);
        return <MarkdownContent content={processedContent} />;
    };

    const renderEditor = () => {
        return <MarkdownEditor content={content} onSave={handleSave} onCancel={handleCancel} />;
    };

    const renderCollapseButton = () => {
        return (
            <button
                onClick={() => toggleCollapse(id, !isCollapsed)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title={isCollapsed ? 'Expand message' : 'Collapse message'}
            >
                {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronDown size={14} />}
            </button>
        );
    };

    const renderOperations = () => {
        if (isEditing) {
            return null;
        }

        return (
            <MessageOperations
                onCopyAsMarkdown={() => onCopyAsMarkdown(message.id)}
                onCopyToThis={() => onCopyToThis(message.id)}
                onEdit={handleEdit}
                onSliceToThis={() => onSliceToThis(message.id)}
                onCollapseAllAbove={() => onCollapseAllAbove(message.id)}
            />
        );
    };

    const renderModelInfo = () => {
        if (role === 'assistant' && model) {
            return (
                <div className="text-xs text-gray-600 ml-2">
                    {model}
                </div>
            );
        }
        return null;
    };

    return (
        <Element name={`message-${index}`}>
            <div className={`rounded-lg p-3 mb-4 scroll-mt-[60px] ${styles.container}`}>
                <Waypoint
                    onEnter={() => onEnter(index)}
                    topOffset={100}
                    bottomOffset="100%"
                />
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {renderCollapseButton()}
                        <div className="text-xs text-gray-500 font-medium uppercase">
                            {role}
                        </div>
                        {renderModelInfo()}
                    </div>
                    {renderOperations()}
                </div>
                <div className="text-black text-xs">
                    {isEditing ? renderEditor() : renderContent()}
                </div>
            </div>
        </Element>
    );
}
