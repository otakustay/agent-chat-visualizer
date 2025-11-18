import {useState} from 'react';
import {
    useConversationKey,
    useSetSnapshotRoot,
    useCurrentSnapshot,
    useSetCurrentSnapshot,
    createSnapshotNode,
} from '@/atoms/conversation';
import {ChangeType, type ConversationData} from '../interface';
import Header from './Header';
import InputView from './InputView';

const InputPanel = () => {
    const [currentView, setCurrentView] = useState<'source' | 'history'>('source');
    const [conversationKey, setConversationKey] = useConversationKey();
    const [currentSnapshot] = useCurrentSnapshot();
    const setSnapshotRoot = useSetSnapshotRoot();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    const handleDataChange = (data: ConversationData) => {
        setConversationKey(crypto.randomUUID());
        const newRoot = createSnapshotNode(ChangeType.Initial, data);
        setSnapshotRoot(newRoot);
        setCurrentSnapshot(newRoot);
    };

    return (
        <div className="flex flex-col h-full">
            <Header currentView={currentView} onViewChange={setCurrentView} onDataChange={handleDataChange} />
            <InputView
                key={`${conversationKey}/${currentSnapshot.id}`}
                currentView={currentView}
                currentSnapshot={currentSnapshot}
                onCurrentSnapshotChange={setCurrentSnapshot}
                onViewChange={setCurrentView}
            />
        </div>
    );
};

export default InputPanel;
