import {useEffect} from 'react';
import {useSnapshotRootValue, useSetCurrentSnapshot} from '../../atoms/conversation';
import InputPanel from './InputPanel';
import Preview from './Preview';

export default function ConversationModule() {
    const rootNode = useSnapshotRootValue();
    const setCurrentSnapshot = useSetCurrentSnapshot();

    useEffect(() => {
        setCurrentSnapshot(rootNode);
    }, [rootNode, setCurrentSnapshot]);

    return (
        <div className="flex h-screen">
            <div className="w-[30%]">
                <InputPanel />
            </div>
            <div className="w-[70%]">
                <Preview />
            </div>
        </div>
    );
}
