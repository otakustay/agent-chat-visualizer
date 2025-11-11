interface JsonViewProps {
    data: unknown;
    highlight?: boolean;
}

export default function JsonView({data}: JsonViewProps) {
    return (
        <pre className="flex-1 overflow-auto p-4 text-sm bg-gray-50">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
