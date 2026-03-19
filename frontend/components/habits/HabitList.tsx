"use client";

import { useHabits } from "@/hooks/useHabits";
import HabitCard from "./HabitCard";
import Loader from "@/components/ui/Loader";

export default function HabitList() {
  const { data: habits, isLoading, isError } = useHabits();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader text="Loading habits..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        <p className="text-4xl mb-2">⚠️</p>
        <p className="text-sm">Failed to load habits. Please try again.</p>
      </div>
    );
  }

  if (!habits?.length) {
    return (
      <div className="py-16 text-center text-slate-400">
        <p className="text-5xl mb-3">🎯</p>
        <p className="font-medium text-slate-600">No habits yet</p>
        <p className="text-sm mt-1">
          Start with one small habit. Build from there.
        </p>
      </div>
    );
  }

  // Separate today's progress
  const completed  = habits.filter((h) => h.completedToday);
  const incomplete = habits.filter((h) => !h.completedToday);
  const allDone    = completed.length === habits.length;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-slate-700">
            Today&apos;s progress
          </span>
          <span className="text-sm text-slate-500">
            {completed.length} / {habits.length}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
            style={{
              width: `${(completed.length / habits.length) * 100}%`,
            }}
          />
        </div>
        {allDone && (
          <p className="text-sm text-emerald-600 font-medium mt-2 text-center animate-bounce-xp">
            🎉 All habits done for today! Amazing!
          </p>
        )}
      </div>

      {/* Incomplete habits first */}
      {incomplete.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            To do today
          </p>
          {incomplete.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {/* Completed habits */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
            ✓ Completed today
          </p>
          {completed.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}