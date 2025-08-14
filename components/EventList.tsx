"use client";

import {useEffect, useMemo, useState} from "react";
import {Event, SortOption} from "@/lib/types";
import {EventService} from "@/services/eventService";
import EventCard from "./EventCard";
import EventForm from "./EventForm";
import Navbar from "./Navbar";
import ConfirmModal from "./ConfirmModal";
import EventFilter from "./EventFilter";
import EventSearch from "@/components/EventSearch";

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [modalEvent, setModalEvent] = useState<Event | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);

    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortOption, setSortOption] = useState<SortOption>("date_desc");

    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"all" | "favorites">("all");

    const CHUNK_SIZE = 6;
    const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

    useEffect(() => {
        setEvents(EventService.get());
    }, []);

    const handleSave = (event: Event) => {
        if (events.some(e => e.id === event.id)) EventService.update(event);
        else EventService.add(event);
        setEvents(EventService.get());
        setShowForm(false);
        setModalEvent(null);
    };

    const handleDelete = () => {
        if (!deleteEvent) return;
        EventService.delete(deleteEvent.id);
        setEvents(EventService.get());
        setDeleteEvent(null);
    };

    const filteredEvents = useMemo(() => {
        return tab === "all"
            ? EventService.filterAndSort(events, filterCategory, filterStatus, sortOption, search)
            : EventService.getFavorites().filter(e =>
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
            );
    }, [events, tab, filterCategory, filterStatus, sortOption, search]);

    const visibleEvents = filteredEvents.slice(0, visibleCount);
    const loadMore = () => setVisibleCount(prev => prev + CHUNK_SIZE);

    return (
        <>
            <Navbar
                tab={tab}
                setTab={setTab}
                onAdd={() => { setModalEvent(null); setShowForm(true); }}
                onExport={() => EventService.export(filteredEvents)}
            />

            <EventFilter
                category={filterCategory}
                status={filterStatus}
                sortOption={sortOption}
                onChange={({ category, status, sortOption }) => {
                    setFilterCategory(category);
                    setFilterStatus(status);
                    setSortOption(sortOption);
                    setVisibleCount(CHUNK_SIZE);
                }}
            />

            <EventSearch value={search} onChange={value => { setSearch(value); setVisibleCount(CHUNK_SIZE); }} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleEvents.map(e => (
                    <EventCard
                        key={e.id}
                        event={e}
                        onEdit={ev => { setModalEvent(ev); setShowForm(true); }}
                        onDelete={ev => setDeleteEvent(ev)}
                        onToggleFavorite={id => {
                            EventService.toggleFavorite(id);
                            setEvents(EventService.get());
                        }}
                    />
                ))}
            </div>

            {visibleCount < filteredEvents.length && (
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={loadMore}
                    >
                        Загрузить ещё
                    </button>
                </div>
            )}

            {showForm && <EventForm event={modalEvent} onSave={handleSave} onClose={() => setShowForm(false)} />}
            {deleteEvent && <ConfirmModal message={`Удалить "${deleteEvent.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteEvent(null)} />}
        </>
    );
}