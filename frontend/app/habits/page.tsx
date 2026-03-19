"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import HabitList from "@/components/habits/HabitList";
import CreateHabitModal from "@/components/habits/CreateHabitModal";
import { useHabitStats } from "@/hooks/useHabits";
import StatsCard from "@/components/shared/StatsCard";

export default function HabitsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: stats } = useHabitStats();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Habits</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Small actions. Compounding results.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New habit
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Active habits"
            value={stats.totalHabits}
            icon="🎯"
            color="indigo"
          />
          <StatsCard
            title="Done today"
            value={`${stats.completedToday}/${stats.totalHabits}`}
            icon="✅"
            color="emerald"
          />
          <StatsCard
            title="Avg. streak"
            value={`${stats.averageStreak}d`}
            icon="🔥"
            color="amber"
          />
          <StatsCard
            title="Longest streak"
            value={`${stats.longestStreak}d`}
            icon="🏆"
            color="purple"
          />
        </div>
      )}

      {/* Habit list */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <HabitList />
      </div>

      {/* Create modal */}
      <CreateHabitModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}