import Source from './Source';
import Preview from './Preview';

export default function ConversationModule() {
    return (
        <div className="flex h-screen">
            <div className="w-[30%]">
                <Source />
            </div>
            <div className="w-[70%]">
                <Preview />
            </div>
        </div>
    );
}
