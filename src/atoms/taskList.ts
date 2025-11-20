import {atom, useAtomValue, useSetAtom} from 'jotai';

// 任务类型枚举
export const enum TaskType {
    EditMessage = 'EditMessage'
}

// 任务状态枚举
export const enum TaskStatus {
    Running = 'Running',
    Failed = 'Failed',
    Completed = 'Completed'
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

// 任务联合类型
export type Task = EditMessageTask;

// 任务列表atom
const taskListAtom = atom<Task[]>([]);

export const useTaskList = () => useAtomValue(taskListAtom);
export const useSetTaskList = () => useSetAtom(taskListAtom);
