import {FiCopy, FiEdit, FiTrendingUp, FiMoreVertical, FiScissors, FiChevronsUp} from 'react-icons/fi';
import type {MenuOption} from '@/components/MenuDropdown';
import MenuDropdown from '@/components/MenuDropdown';

interface MessageOperationsProps {
    onCopyAsMarkdown: () => void;
    onCopyToThis: () => void;
    onEdit: () => void;
    onSliceToThis: () => void;
    onCollapseAllAbove: () => void;
}
export default function MessageOperations(
    {onCopyAsMarkdown, onCopyToThis, onEdit, onSliceToThis, onCollapseAllAbove}: MessageOperationsProps,
) {
    const options: MenuOption[] = [
        {
            label: 'Edit Markdown',
            onClick: onEdit,
            icon: <FiEdit className="w-4 h-4" />,
        },
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
        {
            label: 'Slice To This',
            onClick: onSliceToThis,
            icon: <FiScissors className="w-4 h-4" />,
        },
        {
            label: 'Collapse all Above',
            onClick: onCollapseAllAbove,
            icon: <FiChevronsUp className="w-4 h-4" />,
        },
    ];

    return (
        <MenuDropdown options={options}>
            <FiMoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </MenuDropdown>
    );
}
