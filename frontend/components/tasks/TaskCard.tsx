"use client";

import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";
import type { Task } from "@/types/task.types";
import PriorityBadge from "./PriorityBadge";
import { useCompleteTask, useDeleteTask } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const isCompleted = task.status === "completed";
  const isOverdue =
    task.deadline && isPast(new Date(task.deadline)) && !isCompleted;
  const isDueToday = task.deadline && isToday(new Date(task.deadline));

  const handleComplete = async () => {
    if (isCompleted || completeTask.isPending) return;
    await completeTask.mutateAsync(task.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask.mutateAsync(task.id);
  };

  return (
    <div
      className={clsx(
        "group flex items-start gap-3 p-4 bg-white rounded-xl border transition-all duration-200",
        "hover:shadow-sm",
        isCompleted
          ? "border-slate-100 opacity-60"
          : isOverdue
          ? "border-red-200 bg-red-50/30"
          : "border-slate-100 hover:border-slate-200"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        disabled={isCompleted || completeTask.isPending}
        className={clsx(
          "mt-0.5 flex-shrink-0 transition-all duration-200",
          isCompleted
            ? "text-emerald-500"
            : "text-slate-300 hover:text-indigo-500",
          completeTask.isPending && "animate-pulse"
        )}
        aria-label={isCompleted ? "Task completed" : "Mark as complete"}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={clsx(
              "text-sm font-medium text-slate-900 leading-snug",
              isCompleted && "line-through text-slate-400"
            )}
          >
            {task.title}
          </p>

          {/* Delete button — hidden by default, shown on hover */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={clsx(
              "flex-shrink-0 p-1 rounded-lg text-slate-300 transition-all duration-150",
              "opacity-0 group-hover:opacity-100",
              "hover:text-red-500 hover:bg-red-50",
              isDeleting && "opacity-100 animate-pulse"
            )}
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <PriorityBadge priority={task.priority} size="sm" />

          {/* Deadline */}
          {task.deadline && (
            <span
              className={clsx(
                "inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5",
                isOverdue
                  ? "bg-red-100 text-red-600"
                  : isDueToday
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {isOverdue ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {isOverdue
                ? "Overdue"
                : isDueToday
                ? "Due today"
                : format(new Date(task.deadline), "MMM d")}
            </span>
          )}

          {/* Tags */}
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 rounded-full px-2 py-0.5"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}

          {task.tags.length > 2 && (
            <span className="text-xs text-slate-400">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}