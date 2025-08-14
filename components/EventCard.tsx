"use client";

import { Event } from "@/lib/types";

interface Props {
    event: Event;
    onEdit: (event: Event) => void;
    onDelete: (event: Event) => void;
    onToggleFavorite: (id: number) => void;
}

export default function EventCard({ event, onEdit, onDelete, onToggleFavorite }: Props) {
    return (
        <div className="border p-4 rounded shadow hover:shadow-md transition relative bg-white">
            <h3 className="font-bold mb-1">{event.title}</h3>
            <p className="mb-1 text-sm">{event.description}</p>
            <p className="mb-1 text-xs">{new Date(event.date).toLocaleString()}</p>
            <p className="mb-1 text-xs">{event.category}</p>
            <p className="mb-2 text-xs">{event.status}</p>

            <div className="flex flex-wrap gap-2 mt-2">
                <button
                    onClick={() => onEdit(event)}
                    className="text-white bg-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                    Редактировать
                </button>
                <button
                    onClick={() => onDelete(event)}
                    className="text-white bg-red-500 px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                    Удалить
                </button>
                <div className="cursor-pointer text-lg ms-auto" onClick={() => onToggleFavorite(event.id)}>
                    {event.favorite ? "⭐" : "☆"}
                </div>
            </div>
        </div>
    );
}