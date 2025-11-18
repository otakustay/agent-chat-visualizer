import InputPanel from './InputPanel';
import Preview from './Preview';

export default function ConversationModule() {
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
