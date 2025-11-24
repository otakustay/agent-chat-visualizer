import {atom, useAtom, useSetAtom} from 'jotai';
import type {ConversationData, SnapshotNode} from '../modules/Conversation/interface';
import {ChangeType} from '../modules/Conversation/interface';

const generateOptimizedId = (changeType: ChangeType, timestamp: number): string => {
    if (changeType === ChangeType.Initial) {
        return 'initial';
    }

    // 编辑节点使用与原generateNodeId相同的格式
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `edit-${hours}${minutes}${seconds}.${milliseconds}`;
};

export const createSnapshotNode = (changeType: ChangeType, data: ConversationData): SnapshotNode => {
    const timestamp = Date.now();
    return {
        id: generateOptimizedId(changeType, timestamp),
        timestamp,
        changeType,
        data,
        children: [],
    };
};

const conversationKeyAtom = atom<string>(crypto.randomUUID());
const snapshotRootAtom = atom<SnapshotNode>(createSnapshotNode(ChangeType.Initial, {messages: []}));
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
