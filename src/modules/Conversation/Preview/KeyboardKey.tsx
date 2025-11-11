interface KeyboardKeyProps {
    children: string;
}

export default function KeyboardKey({children}: KeyboardKeyProps) {
    return (
        <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
            {children}
        </kbd>
    );
}
