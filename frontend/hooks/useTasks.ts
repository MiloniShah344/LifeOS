"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, type GetTasksParams } from "@/services/tasks.api";
import { useToast } from "./useToast";
import { updateUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types/task.types";

// Query key factory — centralizes all task-related cache keys
export const taskKeys = {
  all:    () => ["tasks"] as const,
  list:   (params?: GetTasksParams) => ["tasks", "list", params] as const,
  detail: (id: string) => ["tasks", "detail", id] as const,
  stats:  () => ["tasks", "stats"] as const,
};

// Fetch all tasks
export function useTasks(params?: GetTasksParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.getAll(params),
  });
}

// Fetch a single task
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: !!id, // don't run if no id
  });
}

// Fetch stats
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => tasksApi.getStats(),
  });
}

// Create task mutation
export function useCreateTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
    onSuccess: (newTask) => {
      // Invalidate the task list — TanStack Query will refetch automatically
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      toast.success(`Task "${newTask.title}" created!`);
    },
    onError: () => {
      toast.error("Failed to create task. Please try again.");
    },
  });
}

// Update task mutation
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      tasksApi.update(id, payload),
    // OPTIMISTIC UPDATE — update UI immediately, before the server responds
    // If the server fails, we roll back automatically
    onMutate: async ({ id, payload }) => {
      // Cancel any in-flight refetches (to avoid overwriting optimistic update)
      await queryClient.cancelQueries({ queryKey: taskKeys.all() });

      // Snapshot current data (for rollback on error)
      const previousTasks = queryClient.getQueryData(taskKeys.list());

      // Optimistically update the cached data
      queryClient.setQueryData(taskKeys.list(), (old: { data: Task[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((task) =>
            task.id === id ? { ...task, ...payload } : task
          ),
        };
      });

      // Return snapshot for potential rollback
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      // Rollback to previous data on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.list(), context.previousTasks);
      }
      toast.error("Failed to update task.");
    },
    onSettled: () => {
      // Always refetch after mutation to sync with server truth
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
    },
  });
}

// Complete task mutation (awards XP)
export function useCompleteTask() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => tasksApi.complete(id),
    onSuccess: ({ xpAwarded }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      // Update XP in Redux store immediately
      dispatch(updateUser({ xp: xpAwarded })); // backend returns updated xp
      toast.success(`Task complete! +${xpAwarded} XP ⚡`);
    },
    onError: () => {
      toast.error("Failed to complete task.");
    },
  });
}

// Delete task mutation
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      toast.success("Task deleted.");
    },
    onError: () => {
      toast.error("Failed to delete task.");
    },
  });
}