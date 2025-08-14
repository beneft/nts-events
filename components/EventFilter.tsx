
import {SortOption} from "@/lib/types";

interface Props {
    category: string;
    status: string;
    sortOption: SortOption;
    onChange: (filters: { category: string; status: string; sortOption: string }) => void;
}

export default function EventFilter({ category, status, sortOption, onChange }: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <select value={category} onChange={e => onChange({ category: e.target.value, status, sortOption })} className="border p-2 rounded w-full sm:w-auto">
                <option value="All">Все категории</option>
                <option value="Conference">Conference</option>
                <option value="Meeting">Meeting</option>
                <option value="Webinar">Webinar</option>
            </select>
            <select value={status} onChange={e => onChange({ category, status: e.target.value, sortOption })} className="border p-2 rounded w-full sm:w-auto">
                <option value="All">Все статусы</option>
                <option value="Planned">Planned</option>
                <option value="Completed">Completed</option>
            </select>
            <select value={sortOption} onChange={e => onChange({ category, status, sortOption: e.target.value as SortOption })} className="border p-2 rounded w-full sm:w-auto">
                <option value="date_asc">Дата ↑</option>
                <option value="date_desc">Дата ↓</option>
                <option value="title_asc">Название ↑</option>
                <option value="title_desc">Название ↓</option>
            </select>
        </div>
    );
}