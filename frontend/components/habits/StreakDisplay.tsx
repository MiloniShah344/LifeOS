import { clsx } from "clsx";
import { subDays, isSameDay, parseISO } from "date-fns";

interface StreakDisplayProps {
  recentCompletions: string[];  // last 30 days ISO dates
  currentStreak: number;
  days?: number;                // how many days to show (default 30)
}

export default function StreakDisplay({
  recentCompletions,
  currentStreak,
  days = 30,
}: StreakDisplayProps) {
  // Build an array of the last N days
  const today = new Date();
  const daySlots = Array.from({ length: days }, (_, i) =>
    subDays(today, days - 1 - i)
  );

  // Check if a given date has a completion
  const isCompleted = (date: Date) =>
    recentCompletions.some((c) => isSameDay(parseISO(c), date));

  const isToday = (date: Date) => isSameDay(date, today);

  return (
    <div className="space-y-2">
      {/* Grid of day dots */}
      <div className="flex gap-0.5 flex-wrap">
        {daySlots.map((date, i) => {
          const completed = isCompleted(date);
          const todaySlot = isToday(date);
          return (
            <div
              key={i}
              title={date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              className={clsx(
                "w-3 h-3 rounded-sm transition-colors",
                completed
                  ? "bg-emerald-500"
                  : todaySlot
                  ? "bg-slate-200 ring-1 ring-indigo-400 ring-offset-1"
                  : "bg-slate-100"
              )}
            />
          );
        })}
      </div>

      {/* Streak count */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">🔥</span>
        <span className="text-sm font-semibold text-slate-700">
          {currentStreak} day streak
        </span>
        {currentStreak >= 7 && (
          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
            On fire!
          </span>
        )}
      </div>
    </div>
  );
}