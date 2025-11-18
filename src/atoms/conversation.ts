import {atom, useAtom} from 'jotai';
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
const currentSnapshotAtom = atom<SnapshotNode>(createSnapshotNode(ChangeType.Initial, {messages: []}));

export const useConversationKey = () => useAtom(conversationKeyAtom);
export const useSnapshotRootValue = () => useAtom(snapshotRootAtom)[0];
export const useSetSnapshotRoot = () => useAtom(snapshotRootAtom)[1];
export const useCurrentSnapshot = () => useAtom(currentSnapshotAtom);
export const useSetCurrentSnapshot = () => useAtom(currentSnapshotAtom)[1];

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
