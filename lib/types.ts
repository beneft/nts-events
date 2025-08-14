export interface Event {
    id: number;
    title: string;
    description?: string;
    date: string;
    category: string;
    status: "Planned" | "Completed";
    favorite?: boolean;
}

const sortOptions = ["date_asc", "date_desc", "title_asc", "title_desc"] as const;
export type SortOption = (typeof sortOptions)[number];