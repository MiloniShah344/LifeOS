"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "./TaskCard";
import Loader from "@/components/ui/Loader";
import { clsx } from "clsx";
import type { Priority } from "@/types/common.types";

type FilterStatus = "all" | "pending" | "completed";
type FilterPriority = "all" | Priority;

export default function TaskList() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useTasks({
    status: statusFilter !== "all" ? statusFilter : undefined,
    priority: priorityFilter !== "all" ? priorityFilter : undefined,
    search: search || undefined,
  });

  const statusTabs: { value: FilterStatus; label: string }[] = [
    { value: "all",       label: "All" },
    { value: "pending",   label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const priorityTabs: { value: FilterPriority; label: string }[] = [
    { value: "all",    label: "Any priority" },
    { value: "urgent", label: "🔴 Urgent" },
    { value: "high",   label: "🟠 High" },
    { value: "medium", label: "🔵 Medium" },
    { value: "low",    label: "⚪ Low" },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={clsx(
          "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white",
          "text-sm placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        )}
      />

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {statusTabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              statusFilter === value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="flex gap-2 flex-wrap">
        {priorityTabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPriorityFilter(value)}
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium border transition-all",
              priorityFilter === value
                ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader text="Loading tasks..." />
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-red-500">
          <p className="text-4xl mb-2">⚠️</p>
          <p className="text-sm">Failed to load tasks. Please try again.</p>
        </div>
      ) : !data?.data.length ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-5xl mb-3">📝</p>
          <p className="font-medium text-slate-600">No tasks found</p>
          <p className="text-sm mt-1">
            {statusFilter !== "all" || priorityFilter !== "all" || search
              ? "Try adjusting your filters"
              : "Create your first task above!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Task count */}
          <p className="text-xs text-slate-400 pl-1">
            {data.total} task{data.total !== 1 ? "s" : ""}
          </p>
          {data.data.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}