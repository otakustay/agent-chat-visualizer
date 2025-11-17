import {Element} from 'react-scroll';
import {Waypoint} from 'react-waypoint';
import type {ConversationMessageItem} from '../interface';
import {preprocessXmlToCodeBlock} from '../Source/utils/string';
import MarkdownContent from './MarkdownContent';
import MessageOperations from './MessageOperations';

interface MessageItemProps {
    message: ConversationMessageItem;
    index: number;
    onEnter: (index: number) => void;
    onCopyAsMarkdown: (index: number) => void;
    onCopyToThis: (index: number) => void;
}

export default function MessageItem({message, index, onEnter, onCopyAsMarkdown, onCopyToThis}: MessageItemProps) {
    const {role, content} = message;

    const getMessageStyles = () => {
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

    const styles = getMessageStyles();

    const renderContent = () => {
        const processedContent = preprocessXmlToCodeBlock(content);
        return <MarkdownContent content={processedContent} />;
    };

    return (
        <Element name={`message-${index}`}>
            <div className={`rounded-lg p-4 mb-4 scroll-mt-[60px] ${styles.container}`}>
                <Waypoint
                    onEnter={() => onEnter(index)}
                    topOffset={100}
                    bottomOffset="100%"
                />
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500 font-medium uppercase">
                        {role}
                    </div>
                    <MessageOperations
                        onCopyAsMarkdown={() => onCopyAsMarkdown(index)}
                        onCopyToThis={() => onCopyToThis(index)}
                    />
                </div>
                <div className="text-black text-xs">
                    {renderContent()}
                </div>
            </div>
        </Element>
    );
}
