import {MdContentPaste, MdHistory, MdSource} from 'react-icons/md';
import {toast} from 'react-hot-toast';
import {useSetTaskDrawerOpen, useInputPanelView, useSetInputPanelView} from '@/atoms/ui';
import TaskListDrawer from '@/modules/Conversation/TaskList/TaskListDrawer';
import TaskListButton from '@/modules/Conversation/TaskList/TaskListButton';
import {ConversationSchema} from '../interface';
import type {ConversationData} from '../interface';

interface HeaderProps {
    onDataChange: (data: ConversationData) => void;
}

const Header = ({onDataChange}: HeaderProps) => {
    const setTaskDrawerOpen = useSetTaskDrawerOpen();
    const currentView = useInputPanelView();
    const setCurrentView = useSetInputPanelView();

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = JSON.parse(text) as unknown;

            const result = ConversationSchema.safeParse(parsed);

            if (!result.success) {
                toast.error('Invalid JSON format');
                return;
            }

            onDataChange(result.data);
            setCurrentView('source');
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
