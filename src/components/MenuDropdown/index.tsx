import {Root, Trigger, Portal, Content, Item} from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';

export interface MenuOption {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

interface MenuDropdownProps {
    options: MenuOption[];
    children: React.ReactNode;
}

export default function MenuDropdown({children, options}: MenuDropdownProps) {
    const contentClassName = classNames(
        'bg-white',
        'border border-gray-200 rounded-md shadow-lg',
        'py-1 min-w-[120px]',
        'z-50'
    );

    const itemClassName = classNames(
        'px-3 py-2',
        'text-xs text-gray-700',
        'cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
        'flex items-center'
    );

    const renderMenuItem = (option: MenuOption) => (
        <Item
            key={option.label}
            className={itemClassName}
            onClick={option.onClick}
        >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
        </Item>
    );

    return (
        <Root>
            <Trigger asChild>
                {children}
            </Trigger>
            <Portal>
                <Content className={contentClassName} sideOffset={5}>
                    {options.map(renderMenuItem)}
                </Content>
            </Portal>
        </Root>
    );
}
