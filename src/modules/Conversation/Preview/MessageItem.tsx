import {Streamdown, defaultRehypePlugins, defaultRemarkPlugins} from 'streamdown';
import remarkBreaks from 'remark-breaks';
import {Element} from 'react-scroll';
import {Waypoint} from 'react-waypoint';
import type {ConversationMessageItem} from '../interface';
import {preprocessXmlToCodeBlock} from '../Source/utils/string';
import rehypeUnescapeBackticks from './unescapeBackticks';

const REMARK_PLUGINS = [...Object.values(defaultRemarkPlugins), remarkBreaks];
const REHYPE_PLUGINS = [
    ...Object.entries(defaultRehypePlugins).filter(([key]) => key !== 'raw').map(([, plugin]) => plugin),
    rehypeUnescapeBackticks,
];

interface MessageItemProps {
    message: ConversationMessageItem;
    index: number;
    onEnter: (index: number) => void;
}

export default function MessageItem({message, index, onEnter}: MessageItemProps) {
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
        return (
            <Streamdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
                {processedContent}
            </Streamdown>
        );
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
                </div>
                <div className="text-black text-xs">
                    {renderContent()}
                </div>
            </div>
        </Element>
    );
}
