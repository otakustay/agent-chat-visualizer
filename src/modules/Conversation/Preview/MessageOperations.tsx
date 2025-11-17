import {FiCopy, FiTrendingUp, FiMoreVertical} from 'react-icons/fi';
import type {MenuOption} from '../../../components/MenuDropdown';
import MenuDropdown from '../../../components/MenuDropdown';

interface MessageOperationsProps {
    onCopyAsMarkdown: () => void;
    onCopyToThis: () => void;
}

export default function MessageOperations({onCopyAsMarkdown, onCopyToThis}: MessageOperationsProps) {
    const options: MenuOption[] = [
        {
            label: 'Copy as Markdown',
            onClick: onCopyAsMarkdown,
            icon: <FiCopy className="w-4 h-4" />,
        },
        {
            label: 'Copy to This',
            onClick: onCopyToThis,
            icon: <FiTrendingUp className="w-4 h-4" />,
        },
    ];

    return (
        <MenuDropdown options={options}>
            <FiMoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </MenuDropdown>
    );
}
