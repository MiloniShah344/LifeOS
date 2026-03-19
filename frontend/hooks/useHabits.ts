"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsApi } from "@/services/habits.api";
import { useToast } from "./useToast";
import { updateUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { CreateHabitPayload } from "@/types/habit.types";

export const habitKeys = {
  all:    () => ["habits"] as const,
  list:   () => ["habits", "list"] as const,
  detail: (id: string) => ["habits", "detail", id] as const,
  logs:   (id: string) => ["habits", "logs", id] as const,
  stats:  () => ["habits", "stats"] as const,
};

export function useHabits() {
  return useQuery({
    queryKey: habitKeys.list(),
    queryFn: habitsApi.getAll,
  });
}

export function useHabitStats() {
  return useQuery({
    queryKey: habitKeys.stats(),
    queryFn: habitsApi.getStats,
  });
}

// Check in a habit (the main action)
export function useHabitCheckIn() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      habitsApi.checkIn(id, note),
    onSuccess: ({ habit, xpAwarded }) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: habitKeys.all() });

      // Update XP in Redux — add earned XP to current XP
      if (user) {
        dispatch(updateUser({ xp: user.xp + xpAwarded }));
      }

      // Streak-specific toast messages
      if (habit.currentStreak > 0 && habit.currentStreak % 7 === 0) {
        toast.success(`🔥 ${habit.currentStreak} day streak! You're on fire! +${xpAwarded} XP`);
      } else if (habit.currentStreak === 1) {
        toast.success(`Great start! Streak begun! +${xpAwarded} XP ⚡`);
      } else {
        toast.success(`${habit.title} done! ${habit.currentStreak} day streak 🔥 +${xpAwarded} XP`);
      }
    },
    onError: () => {
      toast.error("Failed to log habit check-in.");
    },
  });
}

// Undo today's check-in
export function useUndoHabitCheckIn() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => habitsApi.undoCheckIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all() });
      toast.info("Check-in undone.");
    },
    onError: () => {
      toast.error("Couldn't undo check-in.");
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateHabitPayload) => habitsApi.create(payload),
    onSuccess: (habit) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all() });
      toast.success(`Habit "${habit.title}" created! Build that streak! 🎯`);
    },
    onError: () => {
      toast.error("Failed to create habit.");
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => habitsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all() });
      toast.success("Habit deleted.");
    },
    onError: () => {
      toast.error("Failed to delete habit.");
    },
  });
}