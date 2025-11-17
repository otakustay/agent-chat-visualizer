import {useState, useRef} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import {scroller} from 'react-scroll';
import toast from 'react-hot-toast';
import type {ConversationMessageItem} from '../interface';
import KeyboardKey from './KeyboardKey';
import MessageItem from './MessageItem';
import NavigationButton from './NavigationButton';

function PreviewHeader() {
    return (
        <div className="flex items-center gap-2 p-2 border-b border-gray-300">
            <div className="px-3 py-1.5 text-sm font-medium text-gray-700">Preview</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
                <KeyboardKey>N</KeyboardKey>
                <span>Next</span>
                <span>⏐</span>
                <KeyboardKey>P</KeyboardKey>
                <span>Previous</span>
            </div>
        </div>
    );
}

interface PreviewProps {
    messages?: ConversationMessageItem[];
}
export default function Preview({messages = []}: PreviewProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const handleCopyAsMarkdown = async (index: number) => {
        try {
            const message = messages[index];
            await navigator.clipboard.writeText(message.content);
            toast.success('Message content copied to clipboard');
        }
        catch {
            toast.error('Copy failed, please try again');
        }
    };

    const handleCopyToThis = async (index: number) => {
        try {
            const messagesToCopy = messages.slice(0, index + 1);
            await navigator.clipboard.writeText(JSON.stringify(messagesToCopy, null, 2));
            toast.success(`${messagesToCopy.length} messages copied`);
        }
        catch {
            toast.error('Copy failed, please try again');
        }
    };

    const handleMessageEnter = (index: number) => {
        setCurrentMessageIndex(index);
    };

    const canGoPrev = currentMessageIndex > 0;
    const canGoNext = currentMessageIndex < messages.length - 1;

    const prevTarget = canGoPrev ? `message-${currentMessageIndex - 1}` : '';
    const nextTarget = canGoNext ? `message-${currentMessageIndex + 1}` : '';

    const scrollToMessage = (index: number) => {
        scroller.scrollTo(
            `message-${index}`,
            {
                duration: 500,
                smooth: true,
                containerId: 'preview-scroll-container',
                offset: -60,
            }
        );
    };

    const handlePrevClick = () => {
        if (canGoPrev) {
            const newIndex = currentMessageIndex - 1;
            setCurrentMessageIndex(newIndex);
            scrollToMessage(newIndex);
        }
    };

    const handleNextClick = () => {
        if (canGoNext) {
            const newIndex = currentMessageIndex + 1;
            setCurrentMessageIndex(newIndex);
            scrollToMessage(newIndex);
        }
    };

    useHotkeys('p', handlePrevClick, {enabled: canGoPrev});
    useHotkeys('n', handleNextClick, {enabled: canGoNext});

    const renderMessageItem = (message: ConversationMessageItem, index: number) => (
        <MessageItem
            key={index}
            message={message}
            index={index}
            onEnter={handleMessageEnter}
            onCopyAsMarkdown={handleCopyAsMarkdown}
            onCopyToThis={handleCopyToThis}
        />
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
            <PreviewHeader />
            <div
                ref={scrollContainerRef}
                id="preview-scroll-container"
                className="flex-1 overflow-auto p-4"
            >
                {renderContent()}
            </div>
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
                <NavigationButton
                    direction="up"
                    target={prevTarget}
                    disabled={!canGoPrev}
                    containerId="preview-scroll-container"
                    onClick={handlePrevClick}
                />
                <NavigationButton
                    direction="down"
                    target={nextTarget}
                    disabled={!canGoNext}
                    containerId="preview-scroll-container"
                    onClick={handleNextClick}
                />
            </div>
        </div>
    );
}
