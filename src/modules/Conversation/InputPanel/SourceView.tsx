import dedent from 'dedent';
import JsonView from '@/components/JsonView';
import {useCurrentSnapshot} from '@/atoms/conversation';

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

const renderEmptyPlaceholder = () => (
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

const SourceView = () => {
    const currentSnapshot = useCurrentSnapshot();
    const {data} = currentSnapshot;

    return (
        <div className="h-full flex flex-col">
            {data.length > 0 ? <JsonView data={data} highlight={false} /> : renderEmptyPlaceholder()}
        </div>
    );
};

export default SourceView;
