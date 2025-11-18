import classNames from 'classnames';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    className?: string;
}

export default function ActionButton({icon, label, onClick, disabled = false, title, className}: ActionButtonProps) {
    const buttonClasses = classNames(
        'flex items-center gap-1 px-3 py-1.5 text-sm rounded',
        {
            'bg-blue-500 text-white hover:bg-blue-600 transition-colors': !disabled,
            'bg-gray-300 text-gray-500 cursor-not-allowed': disabled,
        },
        className
    );

    return (
        <button
            className={buttonClasses}
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
