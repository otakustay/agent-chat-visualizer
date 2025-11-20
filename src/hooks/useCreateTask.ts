import type {TaskType, EditMessageTask} from '@/atoms/taskList';
import {useSetTaskList, TaskStatus} from '@/atoms/taskList';

export function useCreateTask() {
    const setTasks = useSetTaskList();

    return (type: TaskType.EditMessage, snapshotId: string): EditMessageTask => {
        const newTask: EditMessageTask = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            status: TaskStatus.Completed,
            type,
            snapshotId,
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask;
    };
}
