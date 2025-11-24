import {MdPlayCircle, MdError, MdCheckCircle, MdArrowForward} from 'react-icons/md';
import type {Task} from '@/atoms/taskList';
import {TaskStatus, TaskType} from '@/atoms/taskList';
import {useSetTaskDrawerOpen, useSetInputPanelView} from '@/atoms/ui';
import {formatToTimeString} from '@/utils/string';
import {useSetCurrentSnapshot} from '@/atoms/conversation';

interface TaskItemProps {
    task: Task;
}

const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Running:
            return <MdPlayCircle size={20} className="text-blue-500" />;
        case TaskStatus.Failed:
            return <MdError size={20} className="text-red-500" />;
        case TaskStatus.Completed:
            return <MdCheckCircle size={20} className="text-green-500" />;
        default:
            return null;
    }
};

const getTaskTypeLabel = (task: Task) => {
    switch (task.type) {
        case TaskType.EditMessage:
            return 'Edit Message';
        case TaskType.ModelGeneration:
            return `Generate (${task.modelId})`;
        default:
            return 'Unknown Task';
    }
};
export default function TaskItem({task}: TaskItemProps) {
    const setCurrentSnapshot = useSetCurrentSnapshot();
    const setDrawerOpen = useSetTaskDrawerOpen();
    const setInputPanelView = useSetInputPanelView();

    const handleSnapshotClick = () => {
        if (!task.snapshotId) {
            return;
        }

        setCurrentSnapshot(task.snapshotId);
        setDrawerOpen(false);
        setInputPanelView('source');
    };

    const renderSnapshotButton = () => {
        if (!task.snapshotId) {
            return null;
        }

        return (
            <button
                className="flex-shrink-0 p-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                onClick={handleSnapshotClick}
                title="Jump to Snapshot"
            >
                <MdArrowForward size={16} />
            </button>
        );
    };

    return (
        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="relative z-10 flex-shrink-0 w-10 h-10 bg-transparent hover:bg-white rounded-full flex items-center justify-center transition-colors">
                {getStatusIcon(task.status)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate leading-5">
                            {getTaskTypeLabel(task)}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap leading-5">
                            {formatToTimeString(task.timestamp)}
                        </span>
                    </div>

                    {renderSnapshotButton()}
                </div>
            </div>
        </div>
    );
}
