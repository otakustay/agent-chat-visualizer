import {useState} from 'react';
import MDEditor from '@uiw/react-md-editor';
import {FiSave, FiX} from 'react-icons/fi';

interface MarkdownEditorProps {
    content: string;
    onSave: (newContent: string) => void;
    onCancel: () => void;
}

export default function MarkdownEditor({content, onSave, onCancel}: MarkdownEditorProps) {
    const [value, setValue] = useState(content);

    const handleSave = () => {
        onSave(value);
    };

    const handleCancel = () => {
        setValue(content);
        onCancel();
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                    <FiX className="w-3 h-3" />
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
                >
                    <FiSave className="w-3 h-3" />
                    Save
                </button>
            </div>
            <div className="border border-gray-200 rounded">
                <MDEditor
                    hideToolbar
                    value={value}
                    onChange={val => setValue(val ?? '')}
                    height={300}
                    preview="edit"
                    visibleDragbar={false}
                />
            </div>
        </div>
    );
}
