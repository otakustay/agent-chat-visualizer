import TaskItem from '../TaskItem';
import {useTaskList} from '@/atoms/taskList';

export default function TaskTimeline() {
    const tasks = useTaskList();

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-sm">No tasks yet</div>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {tasks.map(task => <TaskItem key={task.id} task={task} />)}
        </div>
    );
}
