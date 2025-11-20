import {MdList} from 'react-icons/md';
import {useTaskList, TaskStatus} from '@/atoms/taskList';

interface TaskListButtonProps {
    onClick: () => void;
}

export default function TaskListButton({onClick}: TaskListButtonProps) {
    const tasks = useTaskList();

    const runningTaskCount = tasks.filter(v => v.status === TaskStatus.Running).length;

    const renderBadge = () => {
        if (runningTaskCount === 0) {
            return null;
        }

        return (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {runningTaskCount > 99 ? '99+' : runningTaskCount}
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                className="w-8 h-8 p-0 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center cursor-pointer transition-colors"
                type="button"
                title="Tasks"
                onClick={onClick}
            >
                <MdList size={16} />
            </button>

            {renderBadge()}
        </div>
    );
}
