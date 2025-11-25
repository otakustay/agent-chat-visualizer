import {useState} from 'react';
import {MdClose, MdSend} from 'react-icons/md';
import {toast} from 'react-hot-toast';
import Drawer from '@/components/Drawer';
import ActionButton from '@/components/ActionButton';
import {
    useModelGenerationDrawerOpen,
    useSetModelGenerationDrawerOpen,
    useSetTaskDrawerOpen,
} from '@/atoms/ui';
import {AVAILABLE_MODELS} from '@/dicts/llm';
import {useModelGeneration} from '@/hooks/useModelGeneration';
import {useCurrentSnapshot} from '@/atoms/conversation';
import {stringifyError} from '@/utils/error';
import ModelSelector from './ModelSelector';

export default function ModelGenerationDrawer() {
    const open = useModelGenerationDrawerOpen();
    const setOpen = useSetModelGenerationDrawerOpen();
    const setTaskDrawerOpen = useSetTaskDrawerOpen();
    const {generateForModel} = useModelGeneration();
    const currentSnapshot = useCurrentSnapshot();

    const [apiKey, setApiKey] = useState('');
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (selectedModels.length === 0) {
            toast.error('Please select at least one model');
            return;
        }

        try {
            for (const modelId of selectedModels) {
                void generateForModel({apiKey, modelId, messages: currentSnapshot.data});
            }

            setOpen(false);
            setTaskDrawerOpen(true);
        }
        catch (ex) {
            toast.error(stringifyError(ex));
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const renderFooter = () => (
        <div className="flex justify-end gap-3">
            <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                type="button"
                onClick={handleCancel}
            >
                <MdClose size={16} />
                Cancel
            </button>
            <ActionButton
                icon={<MdSend size={16} />}
                label="Generate"
                onClick={handleGenerate}
                disabled={!apiKey.trim() || selectedModels.length === 0}
            />
        </div>
    );

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Model Generation"
            footer={renderFooter()}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Open Router API Key
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="sk-or-v1-xxx...xxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Models
                    </label>
                    <ModelSelector
                        value={selectedModels}
                        onSelectChange={setSelectedModels}
                        dataSource={AVAILABLE_MODELS}
                    />
                </div>
            </div>
        </Drawer>
    );
}
