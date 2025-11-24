import {useState} from 'react';
import classNames from 'classnames';
import type {ModelItem} from '@/dicts/llm';
import ModelIcon from '@/components/ModelIcon';

interface ModelItemComponentProps {
    model: ModelItem;
    selected: boolean;
    onClick: () => void;
}

const renderSelectedIndicator = () => (
    <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    </div>
);

function ModelItemComponent({model, selected, onClick}: ModelItemComponentProps) {
    const itemClassName = classNames(
        'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
        {
            'bg-blue-50 border-2 border-blue-300': selected,
            'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100': !selected,
        }
    );

    return (
        <div className={itemClassName} onClick={onClick}>
            <ModelIcon modelId={model.id} />
            <span className="text-sm font-medium text-gray-900">{model.name}</span>
            {selected && renderSelectedIndicator()}
        </div>
    );
}

interface ModelSelectorProps {
    value: string[];
    onSelectChange: (selectedModels: string[]) => void;
    dataSource: ModelItem[];
}

export default function ModelSelector({value, onSelectChange, dataSource}: ModelSelectorProps) {
    const [selected, setSelected] = useState<string[]>(value);

    const handleModelToggle = (modelId: string) => {
        const newSelected = selected.includes(modelId)
            ? selected.filter(id => id !== modelId)
            : [...selected, modelId];
        setSelected(newSelected);
        onSelectChange(newSelected);
    };

    const renderModelItem = (model: ModelItem) => (
        <ModelItemComponent
            key={model.id}
            model={model}
            selected={selected.includes(model.id)}
            onClick={() => handleModelToggle(model.id)}
        />
    );

    return (
        <div className="space-y-2">
            {dataSource.map(renderModelItem)}
        </div>
    );
}
