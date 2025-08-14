interface EventSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function EventSearch({ value, onChange }: EventSearchProps) {
    return (
        <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            className="border p-2 w-full rounded mb-4"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
}