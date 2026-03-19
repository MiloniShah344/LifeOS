import api from "./api";
import type { Habit, CreateHabitPayload, HabitLog, HabitStats } from "@/types/habit.types";

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const { data } = await api.get<Habit[]>("/habits");
    return data;
  },

  getById: async (id: string): Promise<Habit> => {
    const { data } = await api.get<Habit>(`/habits/${id}`);
    return data;
  },

  create: async (payload: CreateHabitPayload): Promise<Habit> => {
    const { data } = await api.post<Habit>("/habits", payload);
    return data;
  },

  // Check off a habit for today — main interaction
  checkIn: async (id: string, note?: string): Promise<{ habit: Habit; log: HabitLog; xpAwarded: number }> => {
    const { data } = await api.post(`/habits/${id}/check-in`, { note });
    return data;
  },

  // Undo today's check-in
  undoCheckIn: async (id: string): Promise<Habit> => {
    const { data } = await api.delete<Habit>(`/habits/${id}/check-in/today`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  getLogs: async (id: string): Promise<HabitLog[]> => {
    const { data } = await api.get<HabitLog[]>(`/habits/${id}/logs`);
    return data;
  },

  getStats: async (): Promise<HabitStats> => {
    const { data } = await api.get<HabitStats>("/habits/stats");
    return data;
  },
};