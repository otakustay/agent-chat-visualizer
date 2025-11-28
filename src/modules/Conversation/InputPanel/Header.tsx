import {MdContentPaste, MdHistory, MdSource} from 'react-icons/md';
import {toast} from 'react-hot-toast';
import {useSetTaskDrawerOpen, useInputPanelView, useSetInputPanelView} from '@/atoms/ui';
import {useUpdateInputData} from '@/atoms/conversation';
import TaskListDrawer from '@/modules/Conversation/TaskList/TaskListDrawer';
import TaskListButton from '@/modules/Conversation/TaskList/TaskListButton';
import {ConversationSchema} from '../interface';

const FIXED_PASTE_DATA = {
    messages: [
        {
            role: 'user',
            content: '这是一个预设的测试消息',
        },
        {
            role: 'assistant',
            content: '这是对预设测试消息的回复',
        },
    ],
    model: 'gpt-3.5-turbo',
};

const Header = () => {
    const setTaskDrawerOpen = useSetTaskDrawerOpen();
    const currentView = useInputPanelView();
    const setCurrentView = useSetInputPanelView();
    const updateInputData = useUpdateInputData();

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = JSON.parse(text) as unknown;

            const result = ConversationSchema.safeParse(parsed);

            if (!result.success) {
                toast.error('Invalid JSON format');
                return;
            }

            updateInputData(result.data);
            toast.success('JSON validated and pasted successfully');
        }
        catch (ex) {
            if (ex instanceof SyntaxError) {
                toast.error('Clipboard content is not valid JSON');
            }
            else {
                toast.error('Failed to read clipboard');
            }
        }
    };

    const handleToggleView = () => {
        setCurrentView(currentView === 'source' ? 'history' : 'source');
    };

    const handleAutoPaste = () => {
        const result = ConversationSchema.safeParse(FIXED_PASTE_DATA);
        if (result.success) {
            updateInputData(result.data);
            toast.success('Fixed data pasted successfully');
        }
        else {
            toast.error('Fixed data format is invalid');
        }
    };

    return (
        <>
            <div className="flex items-center gap-2 p-2 border-b border-gray-300 border-r border-gray-300">
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    type="button"
                    onClick={handlePaste}
                >
                    <MdContentPaste size={16} />
                    Paste
                </button>
                <button
                    id="auto-paste-button"
                    style={{display: 'none'}}
                    type="button"
                    onClick={handleAutoPaste}
                >
                    Auto Paste
                </button>
                <div className="flex items-center gap-1 ml-auto">
                    <TaskListButton onClick={() => setTaskDrawerOpen(true)} />
                    <button
                        className="w-8 h-8 p-0 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center cursor-pointer"
                        type="button"
                        onClick={handleToggleView}
                    >
                        {currentView === 'source' ? <MdHistory size={16} /> : <MdSource size={16} />}
                    </button>
                </div>
            </div>

            <TaskListDrawer />
        </>
    );
};

export default Header;
