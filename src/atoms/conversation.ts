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

// 根据id从root中找到对应的snapshot
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

const findPathToNode = (root: SnapshotNode, target: SnapshotNode, path: SnapshotNode[] = []): SnapshotNode[] | null => {
    if (root.id === target.id) {
        return [...path, root];
    }

    for (const child of root.children) {
        const result = findPathToNode(child, target, [...path, root]);
        if (result) {
            return result;
        }
    }

    return null;
};

const addChildToTree = (root: SnapshotNode, parent: SnapshotNode, child: SnapshotNode): SnapshotNode => {
    const path = findPathToNode(root, parent);
    if (!path) {
        return root;
    }

    const rebuildNode = (node: SnapshotNode, depth: number): SnapshotNode => {
        if (depth === path.length - 1) {
            return {...node, children: [...node.children, child]};
        }

        const nextNodeInPath = path[depth + 1];
        const newChildren = node.children.map(childNode => {
            if (childNode.id === nextNodeInPath.id) {
                return rebuildNode(childNode, depth + 1);
            }
            return childNode;
        });

        return {...node, children: newChildren};
    };

    return rebuildNode(root, 0);
};

export const useAddSnapshotChild = () => {
    const root = useSnapshotRootValue();
    const setRoot = useSetSnapshotRoot();

    return (parent: SnapshotNode, child: SnapshotNode) => {
        const newRoot = addChildToTree(root, parent, child);
        setRoot(newRoot);
    };
};

// 通用的修改snapshot的hook
export const useUpdateSnapshot = () => {
    const root = useSnapshotRootValue();
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

        const newRoot = findAndUpdate(root);
        setRoot(newRoot);

        // 如果更新的是当前snapshot，也要更新当前选中的snapshot
        const currentSnapshot = findSnapshotById(root, snapshotId);
        if (currentSnapshot) {
            const updatedSnapshot = updater(currentSnapshot);
            setCurrentSnapshot(updatedSnapshot.id);
        }
    };
};

export const useSliceToThis = () => {
    const currentSnapshot = useCurrentSnapshot();
    const addSnapshotChild = useAddSnapshotChild();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    return (messageIndex: number) => {
        // 获取当前快照的消息数组
        const currentMessages = Array.isArray(currentSnapshot.data)
            ? currentSnapshot.data
            : currentSnapshot.data.messages || [];

        // 裁剪消息数组到指定索引（包含该索引）
        const slicedMessages = currentMessages.slice(0, messageIndex + 1);

        // 创建新的快照数据
        const newSnapshotData = {messages: slicedMessages};
        const newSnapshot = createSnapshotNode(
            `slice-${messageIndex + 1}-${getCurrentTimestamp()}`,
            ChangeType.Slice,
            newSnapshotData
        );

        // 添加到快照树
        addSnapshotChild(currentSnapshot, newSnapshot);

        // 切换到新快照
        setCurrentSnapshot(newSnapshot.id);

        return newSnapshot;
    };
};
