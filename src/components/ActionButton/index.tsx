interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
}

export default function ActionButton({icon, label, onClick, disabled = false, title}: ActionButtonProps) {
    const baseClasses = 'flex items-center gap-1 px-3 py-1.5 text-sm rounded';
    const activeClasses = 'bg-blue-500 text-white hover:bg-blue-600 transition-colors';
    const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

    return (
        <button
            className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {icon}
            {label}
        </button>
    );
}
