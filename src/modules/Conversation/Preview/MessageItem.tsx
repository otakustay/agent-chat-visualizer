import {useState} from 'react';
import {Element} from 'react-scroll';
import {Waypoint} from 'react-waypoint';
import type {ConversationMessageItem} from '../interface';
import {preprocessXmlToCodeBlock} from '../utils/string';
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
    onCopyAsMarkdown: (index: number) => void;
    onCopyToThis: (index: number) => void;
    onEditMessage: (index: number, newContent: string) => void;
    onSliceToThis: (index: number) => void;
}

export default function MessageItem(props: MessageItemProps) {
    const {message, index, onEnter, onCopyAsMarkdown, onCopyToThis, onEditMessage, onSliceToThis} = props;
    const {role, content} = message;
    const [isEditing, setIsEditing] = useState(false);
    const styles = getMessageStyles(role);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (newContent: string) => {
        onEditMessage(index, newContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderContent = () => {
        const processedContent = preprocessXmlToCodeBlock(content);
        return <MarkdownContent content={processedContent} />;
    };

    const renderEditor = () => {
        return <MarkdownEditor content={content} onSave={handleSave} onCancel={handleCancel} />;
    };

    const renderOperations = () => {
        if (isEditing) {
            return null;
        }

        return (
            <MessageOperations
                onCopyAsMarkdown={() => onCopyAsMarkdown(index)}
                onCopyToThis={() => onCopyToThis(index)}
                onEdit={handleEdit}
                onSliceToThis={() => onSliceToThis(index)}
            />
        );
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
                    <div className="text-xs text-gray-500 font-medium uppercase">
                        {role}
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
