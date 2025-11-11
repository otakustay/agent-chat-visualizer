import {Link} from 'react-scroll';
import {IoChevronUp, IoChevronDown} from 'react-icons/io5';
import classNames from 'classnames';

interface NavigationButtonProps {
    direction: 'up' | 'down';
    target: string;
    disabled: boolean;
    containerId: string;
    onClick?: () => void;
}
export default function NavigationButton({direction, target, disabled, containerId, onClick}: NavigationButtonProps) {
    const Icon = direction === 'up' ? IoChevronUp : IoChevronDown;
    const buttonClassName = classNames(
        'w-10 h-10 rounded-full bg-blue-500 text-white',
        'flex items-center justify-center shadow-lg transition-all',
        {
            'opacity-50 cursor-not-allowed pointer-events-none': disabled,
            'hover:bg-blue-600 active:scale-95 cursor-pointer': !disabled,
        }
    );

    return (
        <Link
            smooth
            to={target}
            duration={500}
            containerId={containerId}
            offset={-60}
            onClick={onClick}
        >
            <button className={buttonClassName} disabled={disabled}>
                <Icon size={20} />
            </button>
        </Link>
    );
}
