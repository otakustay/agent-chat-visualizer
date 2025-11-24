import {atom, useAtom, useSetAtom} from 'jotai';
import type {ConversationData, SnapshotNode} from '../modules/Conversation/interface';
import {ChangeType} from '../modules/Conversation/interface';
import {getCurrentTimestamp} from '@/utils/time';

export function createSnapshotNode(id: string, changeType: ChangeType, data: ConversationData): SnapshotNode {
    const timestamp = getCurrentTimestamp();
    return {
        id,
        timestamp,
        changeType,
        data,
        children: [],
    };
}

const conversationKeyAtom = atom<string>(crypto.randomUUID());
const snapshotRootAtom = atom<SnapshotNode>(createSnapshotNode('initial', ChangeType.Initial, {messages: []}));
const currentSnapshotIdAtom = atom<string>('initial');

export const useConversationKey = () => useAtom(conversationKeyAtom);

export const useSnapshotRootValue = () => useAtom(snapshotRootAtom)[0];

export const useSetSnapshotRoot = () => useSetAtom(snapshotRootAtom);

const findSnapshotById = (root: SnapshotNode, id: string): SnapshotNode | null => {
    if (root.id === id) {
        return root;
    }

    for (const child of root.children) {
        const result = findSnapshotById(child, id);
        if (result) {
            return result;
        }
    }

    return null;
};

export const useCurrentSnapshot = () => {
    const [currentSnapshotId] = useAtom(currentSnapshotIdAtom);
    const root = useSnapshotRootValue();

    const currentSnapshot = findSnapshotById(root, currentSnapshotId);
    return currentSnapshot ?? root;
};

export const useSetCurrentSnapshot = () => {
    const setCurrentSnapshotId = useSetAtom(currentSnapshotIdAtom);

    return (snapshotId: string) => {
        setCurrentSnapshotId(snapshotId);
    };
};
export const useAddSnapshotChild = () => {
    const updateSnapshot = useUpdateSnapshot();

    return (parentId: string, child: SnapshotNode) => {
        updateSnapshot(
            parentId,
            parentNode => ({...parentNode, children: [...parentNode.children, child]})
        );
    };
};

export const useUpdateSnapshot = () => {
    const setRoot = useSetSnapshotRoot();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    return (snapshotId: string, updater: (snapshot: SnapshotNode) => SnapshotNode) => {
        const findAndUpdate = (node: SnapshotNode): SnapshotNode => {
            if (node.id === snapshotId) {
                return updater(node);
            }

            return {
                ...node,
                children: node.children.map(findAndUpdate),
            };
        };

        setRoot(currentRoot => {
            const newRoot = findAndUpdate(currentRoot);

            const currentSnapshot = findSnapshotById(currentRoot, snapshotId);
            if (currentSnapshot) {
                const updatedSnapshot = updater(currentSnapshot);
                setCurrentSnapshot(updatedSnapshot.id);
            }

            return newRoot;
        });
    };
};

export const useSliceToThis = () => {
    const currentSnapshot = useCurrentSnapshot();
    const addSnapshotChild = useAddSnapshotChild();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    return (messageIndex: number) => {
        const currentMessages = Array.isArray(currentSnapshot.data)
            ? currentSnapshot.data
            : currentSnapshot.data.messages || [];

        const slicedMessages = currentMessages.slice(0, messageIndex + 1);

        const newSnapshotData = {messages: slicedMessages};
        const newSnapshot = createSnapshotNode(
            `slice-${messageIndex + 1}-${getCurrentTimestamp()}`,
            ChangeType.Slice,
            newSnapshotData
        );

        addSnapshotChild(currentSnapshot.id, newSnapshot);

        setCurrentSnapshot(newSnapshot.id);

        return newSnapshot;
    };
};
