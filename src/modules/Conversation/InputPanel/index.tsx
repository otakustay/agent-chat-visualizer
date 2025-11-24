import {
    useConversationKey,
    useSetSnapshotRoot,
    useSetCurrentSnapshot,
    createSnapshotNode,
} from '@/atoms/conversation';
import {ChangeType} from '../interface';
import type {ConversationData} from '../interface';
import Header from './Header';
import InputView from './InputView';

const InputPanel = () => {
    const [conversationKey, setConversationKey] = useConversationKey();
    const setSnapshotRoot = useSetSnapshotRoot();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    const handleDataChange = (data: ConversationData) => {
        setConversationKey(crypto.randomUUID());
        const newRoot = createSnapshotNode(ChangeType.Initial, data);
        setSnapshotRoot(newRoot);
        setCurrentSnapshot(newRoot.id);
    };

    return (
        <div className="flex flex-col h-full">
            <Header onDataChange={handleDataChange} />
            <InputView key={conversationKey} />
        </div>
    );
};

export default InputPanel;
