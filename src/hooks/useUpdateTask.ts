import {useSetTaskList} from '@/atoms/taskList';
import type {Task} from '@/atoms/taskList';

export function useUpdateTask() {
    const setTasks = useSetTaskList();

    return (taskId: string, patch: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            (task.id === taskId ? {...task, ...patch} : task)));
    };
}
