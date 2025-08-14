"use client";

interface Props {
    tab: "all" | "favorites";
    setTab: (tab: "all" | "favorites") => void;
    onAdd: () => void;
    onExport: () => void;
}

export default function Navbar({ tab, setTab, onAdd, onExport }: Props) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-3 sm:p-4 rounded shadow mb-6 gap-2 sm:gap-0">
            <div className="text-xl font-bold text-blue-600 mb-2 sm:mb-0">EventManager</div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-2">
                <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${tab === "all" ? "bg-blue-500 text-white" : "border border-gray-300"}`}
                    onClick={() => setTab("all")}
                >
                    Все мероприятия
                </button>
                <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${tab === "favorites" ? "bg-yellow-400 text-white" : "border border-gray-300"}`}
                    onClick={() => setTab("favorites")}
                >
                    Избранные
                </button>
            </div>

            <button
                className="px-3 py-1 sm:px-4 sm:py-2 rounded bg-green-500 text-white text-sm sm:text-base hover:bg-green-600"
                onClick={onAdd}
            >
                Добавить
            </button>
            <button
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-800"
                onClick={onExport}
            >
                Экспорт JSON
            </button>
        </div>
    );
}