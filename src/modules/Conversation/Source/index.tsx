import {MdContentPaste, MdUpload} from 'react-icons/md';
import {useState} from 'react';
import toast from 'react-hot-toast';
import dedent from 'dedent';
import JsonView from '@/components/JsonView';
import ActionButton from '@/components/ActionButton';
import type {ConversationData} from '../interface';
import {ConversationSchema} from '../interface';

const EXAMPLE_ARRAY_JSON = dedent`
    [
      {"role": "...", "content": "..."},
      {"role": "...", "content": "..."}
    ]
`;

const EXAMPLE_OBJECT_JSON = dedent`
    {
      "messages": [
        {"role": "...", "content": "..."},
        {"role": "...", "content": "..."}
      ]
    }
`;

interface SourceHeaderProps {
    onPaste: () => void;
    highlight: boolean;
    onHighlightChange: (checked: boolean) => void;
}

function SourceHeader({onPaste, highlight, onHighlightChange}: SourceHeaderProps) {
    return (
        <div className="flex items-center gap-2 p-2 border-b border-gray-300">
            <ActionButton
                icon={<MdContentPaste size={16} />}
                label="Paste"
                onClick={onPaste}
            />
            <ActionButton
                icon={<MdUpload size={16} />}
                label="Upload"
                disabled
                title="This feature is not yet supported"
            />
            <label className="flex items-center gap-1 ml-auto cursor-pointer">
                <input
                    type="checkbox"
                    checked={highlight}
                    onChange={e => onHighlightChange(e.target.checked)}
                    className="cursor-pointer"
                />
                <span className="text-sm">Highlight</span>
            </label>
        </div>
    );
}

function EmptyPlaceholder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <p>Click the Paste button to paste JSON data</p>
            <div className="mt-4 text-xs text-gray-500">
                <p className="mb-2 text-center">Example formats</p>
                <div className="flex flex-col gap-2">
                    <pre className="bg-gray-50 p-2 rounded">
                        {EXAMPLE_ARRAY_JSON}
                    </pre>
                    <div className="text-center text-gray-400">OR</div>
                    <pre className="bg-gray-50 p-2 rounded">
                        {EXAMPLE_OBJECT_JSON}
                    </pre>
                </div>
            </div>
        </div>
    );
}

interface SourceProps {
    data?: ConversationData | null;
    onDataChange?: (data: ConversationData | null) => void;
}

export default function Source({data, onDataChange}: SourceProps) {
    const [highlight, setHighlight] = useState(false);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = JSON.parse(text) as unknown;

            const result = ConversationSchema.safeParse(parsed);

            if (!result.success) {
                toast.error(
                    'Invalid JSON format'
                );
                return;
            }

            onDataChange?.(result.data);
            toast.success('JSON validated and pasted successfully');
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                toast.error('Clipboard content is not valid JSON');
            }
            else {
                toast.error('Failed to read clipboard');
            }
        }
    };

    return (
        <div className="h-full flex flex-col border-r border-gray-300">
            <SourceHeader onPaste={handlePaste} highlight={highlight} onHighlightChange={setHighlight} />
            {data ? <JsonView data={data} highlight={highlight} /> : <EmptyPlaceholder />}
        </div>
    );
}
