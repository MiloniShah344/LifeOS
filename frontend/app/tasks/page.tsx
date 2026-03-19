"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useTaskStats } from "@/hooks/useTasks";
import StatsCard from "@/components/shared/StatsCard";

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: stats } = useTaskStats();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tasks</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Stay on top of everything
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New task
        </Button>
      </div>

      {/* Mini stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Total tasks"
            value={stats.total}
            icon="📋"
            color="indigo"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon="✅"
            color="emerald"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon="⏳"
            color="amber"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon="🚨"
            color="red"
          />
        </div>
      )}

      {/* Main task list */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <TaskList />
      </div>

      {/* Create task modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}