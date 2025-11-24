import {useSetTaskList} from '@/atoms/taskList';
import type {BaseTask} from '@/atoms/taskList';

export function useUpdateTask() {
    const setTasks = useSetTaskList();

    return (taskId: string, patch: Partial<BaseTask>) => {
        setTasks(prev => prev.map(v => (v.id === taskId ? {...v, ...patch} : v)));
    };
}
