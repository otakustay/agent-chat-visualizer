import {llmApi} from '@/api/llm';
import type {GenerateTextRequest} from '@/api/llm';
import type {ModelGenerationTask} from '@/atoms/taskList';
import {useSetTaskList, useUpdateTaskById, TaskType, TaskStatus} from '@/atoms/taskList';
import {useAddSnapshotChild, useCurrentSnapshot, createSnapshotNode} from '@/atoms/conversation';
import {ChangeType} from '@/modules/Conversation/interface';
import {getCurrentTimestamp} from '@/utils/time';

export function useModelGeneration() {
    const setTaskList = useSetTaskList();
    const updateTaskById = useUpdateTaskById();
    const addSnapshotChild = useAddSnapshotChild();
    const currentSnapshot = useCurrentSnapshot();

    const generateForModel = async (request: GenerateTextRequest) => {
        const taskId = crypto.randomUUID();
        const task: ModelGenerationTask = {
            id: taskId,
            type: TaskType.ModelGeneration,
            status: TaskStatus.Running,
            timestamp: Date.now(),
            modelId: request.modelId,
        };

        setTaskList(prev => [...prev, task]);

        try {
            const content = await llmApi.generateText(request);

            const messages = currentSnapshot.data;

            const newSnapshot = createSnapshotNode(
                `generate-${request.modelId}-${getCurrentTimestamp()}`,
                ChangeType.GenerateByModel,
                [
                    ...messages,
                    {
                        role: 'assistant' as const,
                        content: content,
                        id: crypto.randomUUID(),
                    },
                ]
            );

            addSnapshotChild(currentSnapshot.id, newSnapshot);

            updateTaskById(taskId, {status: TaskStatus.Completed, snapshotId: newSnapshot.id});
        }
        catch {
            updateTaskById(taskId, {status: TaskStatus.Failed});
        }
    };

    return {
        generateForModel,
    };
}
