import {atom, useAtom} from 'jotai';
import type {ConversationData, SnapshotNode} from '../modules/Conversation/interface';
import {ChangeType} from '../modules/Conversation/interface';

export const createSnapshotNode = (changeType: ChangeType, data: ConversationData): SnapshotNode => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    changeType,
    data,
    children: [],
});

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
