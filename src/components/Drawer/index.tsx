import {MdClose} from 'react-icons/md';
import {createPortal} from 'react-dom';
import classNames from 'classnames';
import {useHotkeys} from 'react-hotkeys-hook';
import {RemoveScroll} from 'react-remove-scroll';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export default function Drawer({open, onClose, title, footer, children}: DrawerProps) {
    useHotkeys('esc', onClose, {enabled: open});

    if (!open) {
        return null;
    }

    // 动态类名组装
    const drawerClassName = classNames(
        // 基础布局样式
        'fixed top-0 right-0 h-screen w-[70%] max-w-[800px] bg-white shadow-lg z-[1000]',
        // 弹性布局
        'flex flex-col',
        // 动画效果
        'transform transition-transform duration-300 ease-in-out',
        // 动态显示状态
        {
            'translate-x-0': open,
            'translate-x-full': !open,
        }
    );

    // 背景遮罩类名
    const overlayClassName = classNames(
        'fixed inset-0 bg-black/50 z-[999] transition-all duration-300',
        {
            'opacity-100 visible': open,
            'opacity-0 invisible': !open,
        }
    );

    return createPortal(
        <RemoveScroll enabled={open}>
            <div
                className={overlayClassName}
                onClick={onClose}
            />
            <div className={drawerClassName}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <h2 className="m-0 text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        className="flex items-center justify-center w-8 h-8 border-none bg-transparent cursor-pointer rounded-md text-gray-500 transition-colors hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <MdClose size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                    {children}
                </div>
                {footer && <div className="border-t border-gray-200 p-4 bg-gray-50">{footer}</div>}
            </div>
        </RemoveScroll>,
        document.body
    );
}
