"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Undo2 } from "lucide-react";
import { clsx } from "clsx";
import type { Habit } from "@/types/habit.types";
import StreakDisplay from "./StreakDisplay";
import { useHabitCheckIn, useUndoHabitCheckIn, useDeleteHabit } from "@/hooks/useHabits";
import Badge from "@/components/ui/Badge";

interface HabitCardProps {
  habit: Habit;
}

// Frequency badge config
const frequencyConfig = {
  daily:   { label: "Daily",   color: "primary" as const },
  weekly:  { label: "Weekly",  color: "success" as const },
  monthly: { label: "Monthly", color: "warning" as const },
};

export default function HabitCard({ habit }: HabitCardProps) {
  const [showStreak, setShowStreak] = useState(false);
  const checkIn = useHabitCheckIn();
  const undoCheckIn = useUndoHabitCheckIn();
  const deleteHabit = useDeleteHabit();

  const isLoading = checkIn.isPending || undoCheckIn.isPending;
  const freqConfig = frequencyConfig[habit.frequency];

  const handleCheckIn = async () => {
    if (isLoading) return;
    if (habit.completedToday) {
      await undoCheckIn.mutateAsync(habit.id);
    } else {
      await checkIn.mutateAsync({ id: habit.id });
    }
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border p-5 transition-all duration-200",
        "hover:shadow-sm group",
        habit.completedToday
          ? "border-emerald-200 bg-emerald-50/30"
          : "border-slate-100"
      )}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Icon + Check button */}
        <button
          onClick={handleCheckIn}
          disabled={isLoading}
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
            "flex-shrink-0 transition-all duration-200 relative",
            habit.completedToday
              ? "bg-emerald-100 ring-2 ring-emerald-300"
              : "bg-slate-100 hover:bg-indigo-50 hover:ring-2 hover:ring-indigo-200",
            isLoading && "animate-pulse"
          )}
          aria-label={
            habit.completedToday ? "Undo check-in" : "Check in habit"
          }
        >
          <span className={clsx("transition-all", habit.completedToday && "opacity-60")}>
            {habit.icon}
          </span>
          {/* Overlay check/undo icon */}
          <div
            className={clsx(
              "absolute inset-0 rounded-xl flex items-center justify-center transition-all",
              habit.completedToday
                ? "bg-emerald-500/90"
                : "bg-indigo-500/0 group-hover:bg-indigo-500/10"
            )}
          >
            {habit.completedToday && (
              <CheckCircle2 className="w-6 h-6 text-white" />
            )}
          </div>
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={clsx(
                "font-semibold text-slate-900 text-sm",
                habit.completedToday && "text-emerald-700"
              )}
            >
              {habit.title}
            </h3>
            <Badge variant={freqConfig.color} size="sm">
              {freqConfig.label}
            </Badge>
          </div>

          {habit.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {habit.description}
            </p>
          )}

          {/* Streak pills */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setShowStreak(!showStreak)}
              className="streak-badge cursor-pointer hover:bg-emerald-200 transition-colors"
            >
              🔥 {habit.currentStreak} day streak
            </button>
            {habit.longestStreak > habit.currentStreak && (
              <span className="text-xs text-slate-400">
                Best: {habit.longestStreak}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {habit.completedCount} total
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => deleteHabit.mutateAsync(habit.id)}
          disabled={deleteHabit.isPending}
          className={clsx(
            "p-1.5 rounded-lg text-slate-300 transition-all duration-150 flex-shrink-0",
            "opacity-0 group-hover:opacity-100",
            "hover:text-red-500 hover:bg-red-50"
          )}
          aria-label="Delete habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Streak visualization — toggleable */}
      {showStreak && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">
            Last 30 days
          </p>
          <StreakDisplay
            recentCompletions={habit.recentCompletions}
            currentStreak={habit.currentStreak}
          />
        </div>
      )}

      {/* Completed today banner */}
      {habit.completedToday && (
        <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between">
          <span className="text-xs text-emerald-600 font-medium">
            ✓ Done for today!
          </span>
          <button
            onClick={handleCheckIn}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <Undo2 className="w-3 h-3" />
            Undo
          </button>
        </div>
      )}
    </div>
  );
}