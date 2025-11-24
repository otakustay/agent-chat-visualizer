interface DrawerFooterProps {
    children: React.ReactNode;
}

export default function DrawerFooter({children}: DrawerFooterProps) {
    return (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
            {children}
        </div>
    );
}
