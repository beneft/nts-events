"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Event } from "@/lib/types";
import { formatISO, parseISO } from "date-fns";

type FormValues = {
    title: string;
    description: string;
    date: string;
    category: string;
    status: "Planned" | "Completed";
};

interface Props {
    event?: Event | null;
    onSave: (event: Event) => void;
    onClose: () => void;
}

export default function EventForm({ event, onSave, onClose }: Props) {
    const defaultValues: FormValues = event
        ? {
            title: event.title,
            description: event.description || "",
            date: event.date ? formatISO(parseISO(event.date)).slice(0, 16) : "",
            category: event.category,
            status: event.status,
        }
        : {
            title: "",
            description: "",
            date: "",
            category: "Conference",
            status: "Planned",
        };

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues,
    });

    const submit: SubmitHandler<FormValues> = (data) => {
        onSave({
            id: event?.id || Date.now(),
            ...data,
            date: new Date(data.date).toISOString(),
        });
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">{event ? "Редактировать событие" : "Добавить событие"}</h2>
                <form onSubmit={handleSubmit(submit)} className="space-y-2">
                    <input
                        {...register("title", { required: "Название обязательно" })}
                        placeholder="Название"
                        className="border p-2 w-full rounded"
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    <input
                        {...register("description")}
                        placeholder="Описание"
                        className="border p-2 w-full rounded"
                    />
                    <input
                        {...register("date", {
                            required: "Дата обязательна",
                            validate: value => {
                                if (!value) return "Дата обязательна";
                                const selectedDate = new Date(value);
                                const now = new Date();
                                if (selectedDate < now) return "Дата не может быть в прошлом";
                                return true;
                            }
                        })}
                        type="datetime-local"
                        className="border p-2 w-full rounded"
                    />
                    {errors.date && <p className="text-red-500">{errors.date.message}</p>}
                    <select {...register("category")} className="border p-2 w-full rounded">
                        <option value="Conference">Конференция</option>
                        <option value="Meeting">Встреча</option>
                        <option value="Webinar">Вебинар</option>
                    </select>
                    <select {...register("status")} className="border p-2 w-full rounded">
                        <option value="Planned">Запланировано</option>
                        <option value="Completed">Завершено</option>
                    </select>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
                            Отмена
                        </button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                            {event ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}