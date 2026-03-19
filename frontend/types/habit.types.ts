import type { Frequency } from "./common.types";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;           // emoji icon chosen by user
  frequency: Frequency;
  targetCount: number;    // e.g. 1 (once per day) or 3 (3x per week)
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completedCount: number; // total completions all time
  userId: string;
  createdAt: string;
  // Completion history for the last 30 days
  recentCompletions: string[]; // array of ISO date strings
}

export interface CreateHabitPayload {
  title: string;
  description?: string;
  icon?: string;
  frequency: Frequency;
  targetCount?: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string;
  xpAwarded: number;
  note?: string;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  averageStreak: number;
  totalCompletions: number;
  longestStreak: number;
}