import {atom, useAtomValue, useSetAtom} from 'jotai';

// 任务类型枚举
export const enum TaskType {
    EditMessage = 'EditMessage',
    ModelGeneration = 'ModelGeneration',
    SliceMessage = 'SliceMessage',
}

// 任务状态枚举
export const enum TaskStatus {
    Running = 'Running',
    Failed = 'Failed',
    Completed = 'Completed',
}

// 基础任务接口
export interface BaseTask {
    id: string;
    timestamp: number;
    status: TaskStatus;
    snapshotId?: string;
}

// 编辑消息任务
export interface EditMessageTask extends BaseTask {
    type: TaskType.EditMessage;
    snapshotId: string;
}

// 模型生成任务
export interface ModelGenerationTask extends BaseTask {
    type: TaskType.ModelGeneration;
    modelId: string;
}

// 裁剪消息任务
export interface SliceMessageTask extends BaseTask {
    type: TaskType.SliceMessage;
    snapshotId: string;
    messageIndex: number; // 裁剪到的消息索引
}

// 任务联合类型
export type Task = EditMessageTask | ModelGenerationTask | SliceMessageTask;

// 任务补丁类型
export type TaskPatch = Partial<Omit<Task, 'id' | 'timestamp' | 'type'>>;

// 任务列表atom
const taskListAtom = atom<Task[]>([]);

export const useTaskList = () => useAtomValue(taskListAtom);
export const useSetTaskList = () => useSetAtom(taskListAtom);

// 更新指定ID的任务
export function useUpdateTaskById() {
    const setTaskList = useSetAtom(taskListAtom);

    return (id: string, patch: TaskPatch) => {
        const updateCallback = (task: Task) => task.id === id ? {...task, ...patch} : task;
        setTaskList(prev => prev.map(updateCallback));
    };
}

// 创建裁剪消息任务
export function useCreateSliceTask() {
    const setTaskList = useSetAtom(taskListAtom);

    return (snapshotId: string, messageIndex: number) => {
        const newTask: SliceMessageTask = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            status: TaskStatus.Completed,
            type: TaskType.SliceMessage,
            snapshotId,
            messageIndex,
        };

        setTaskList(prev => [...prev, newTask]);
        return newTask;
    };
}
