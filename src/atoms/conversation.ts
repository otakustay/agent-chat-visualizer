import {atom, useAtom, useSetAtom, useAtomValue} from 'jotai';
import type {ConversationData, SnapshotNode, RawConversationData} from '../modules/Conversation/interface';
import {ChangeType} from '../modules/Conversation/interface';
import {getCurrentTimestamp} from '@/utils/time';
import {useSetInputPanelView} from './ui';

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
const snapshotRootAtom = atom<SnapshotNode>(createSnapshotNode('initial', ChangeType.Initial, []));
const currentSnapshotIdAtom = atom<string>('initial');

export const useConversationKey = () => useAtom(conversationKeyAtom);
export const useSetConversationKey = () => useSetAtom(conversationKeyAtom);

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
        const currentMessages = currentSnapshot.data;
        const slicedMessages = currentMessages.slice(0, messageIndex + 1);

        const newSnapshot = createSnapshotNode(
            `slice-${messageIndex + 1}-${getCurrentTimestamp()}`,
            ChangeType.Slice,
            slicedMessages
        );

        addSnapshotChild(currentSnapshot.id, newSnapshot);

        setCurrentSnapshot(newSnapshot.id);

        return newSnapshot;
    };
};

// 新增折叠状态atom
const messageCollapseStateAtom = atom<Record<string, boolean>>({});

export function useMessageCollapseStateValue() {
    return useAtomValue(messageCollapseStateAtom);
}

export function useSetMessageCollapseState() {
    return useSetAtom(messageCollapseStateAtom);
}

export function useToggleMessageCollapse() {
    const setCollapseState = useSetMessageCollapseState();

    return (messageId: string, collapsed: boolean) => {
        setCollapseState(prev => ({...prev, [messageId]: collapsed}));
    };
}

export function useMessageCollapsed(messageId: string) {
    const collapseState = useMessageCollapseStateValue();
    return collapseState[messageId] ?? false;
}

export function useCollapseAllAbove() {
    const setCollapseState = useSetMessageCollapseState();
    const currentSnapshot = useCurrentSnapshot();

    return (currentMessageIndex: number) => {
        const messages = currentSnapshot.data;
        const newCollapsedEntries = messages.slice(0, currentMessageIndex).map(message => [message.id, true]);
        const newCollapsed = Object.fromEntries(newCollapsedEntries);

        setCollapseState(prev => ({...prev, ...newCollapsed}));
    };
}

export function useUpdateInputData() {
    const setConversationKey = useSetConversationKey();
    const setSnapshotRoot = useSetSnapshotRoot();
    const setCurrentSnapshot = useSetCurrentSnapshot();
    const setCurrentView = useSetInputPanelView();

    return (rawData: RawConversationData) => {
        const messages = Array.isArray(rawData) ? rawData : rawData.messages;
        const model = Array.isArray(rawData) ? 'unknown' : rawData.model ?? 'unknown';
        const internalData = messages.map(message => ({...message, model, id: crypto.randomUUID()}));

        setConversationKey(crypto.randomUUID());
        const newRoot = createSnapshotNode('initial', ChangeType.Initial, internalData);
        setSnapshotRoot(newRoot);
        setCurrentSnapshot(newRoot.id);
        setCurrentView('source');
    };
}
