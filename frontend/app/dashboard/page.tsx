"use client";

import { useAppSelector } from "@/store/store";
import StatsCard from "@/components/shared/StatsCard";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero greeting */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-indigo-200 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-indigo-200 text-sm mt-1">
              Keep your streak alive. You&apos;re doing great!
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="streak" className="text-sm px-3 py-1.5">
              🔥 {user?.streak ?? 0} day streak
            </Badge>
            <Badge variant="level" className="text-sm px-3 py-1.5">
              ⭐ Level {user?.level ?? 1}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Tasks Today"
          value={0}
          subtitle="0 completed"
          icon="✅"
          color="indigo"
          trend={{ value: 0, label: "vs yesterday" }}
        />
        <StatsCard
          title="Active Habits"
          value={0}
          subtitle="0 completed today"
          icon="🎯"
          color="emerald"
        />
        <StatsCard
          title="Total XP"
          value={user?.xp ?? 0}
          subtitle={`${user?.level ?? 1000} XP to next level`}
          icon="⚡"
          color="amber"
        />
        <StatsCard
          title="Current Streak"
          value={`${user?.streak ?? 0} days`}
          subtitle="Keep it going!"
          icon="🔥"
          color="purple"
        />
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">
            Today&apos;s Tasks
          </h3>
          <div className="text-center py-8 text-slate-400">
            <p className="text-4xl mb-2">📝</p>
            <p className="text-sm">No tasks yet — add your first task!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">
            Habits to Check Off
          </h3>
          <div className="text-center py-8 text-slate-400">
            <p className="text-4xl mb-2">🎯</p>
            <p className="text-sm">Build your first habit!</p>
          </div>
        </div>
      </div>
    </div>
  );
}