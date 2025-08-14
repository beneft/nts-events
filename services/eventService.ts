import { Event } from "@/lib/types";

const STORAGE_KEY = "events";

const defaultEvents: Event[] = [
    { id: 1, title: "Tech Conference 2025", description: "Annual tech conference on AI and ML", date: "2025-05-15T10:00:00Z", category: "Conference", status: "Planned" },
    { id: 2, title: "Team Meetup", description: "Monthly team sync", date: "2025-04-30T14:00:00Z", category: "Meeting", status: "Completed" },
];

const read = (): Event[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents));
    return defaultEvents;
};

const write = (events: Event[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

export const EventService = {
    get: () => read(),
    add: (event: Event) => write([...read(), event]),
    update: (event: Event) => write(read().map(e => (e.id === event.id ? event : e))),
    delete: (id: number) => write(read().filter(e => e.id !== id)),

    toggleFavorite: (id: number) => {
        const events = read().map(e => e.id === id ? { ...e, favorite: !e.favorite } : e);
        write(events);
    },

    filterAndSort: (
        events: Event[],
        category: string,
        status: string,
        sortOption: "date_asc" | "date_desc" | "title_asc" | "title_desc",
        search: string = ""
    ) => {
        let filtered = events
            .filter(e => (category === "All" ? true : e.category === category))
            .filter(e => (status === "All" ? true : e.status === status))
            .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false));

        const [field, order] = sortOption.split("_") as ["date" | "title", "asc" | "desc"];
        filtered.sort((a, b) => {
            if (field === "date") {
                const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
                return order === "asc" ? diff : -diff;
            } else {
                const cmp = a.title.localeCompare(b.title);
                return order === "asc" ? cmp : -cmp;
            }
        });

        return filtered;
    },

    getFavorites: () => read().filter(e => e.favorite),

    export: (events: Event[]) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
        const dlAnchorElem = document.createElement("a");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "events.json");
        dlAnchorElem.click();
    },

    getChunk: (offset: number, limit: number, events?: Event[]) => {
        const source = events || read();
        return source.slice(offset, offset + limit);
    },
};