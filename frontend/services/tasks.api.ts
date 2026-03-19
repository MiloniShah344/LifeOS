import api from "./api";
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStats } from "@/types/task.types";
import type { PaginatedResponse } from "@/types/common.types";

export interface GetTasksParams {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const tasksApi = {
  getAll: async (params?: GetTasksParams): Promise<PaginatedResponse<Task>> => {
    const { data } = await api.get<PaginatedResponse<Task>>("/tasks", { params });
    return data;
  },

  getById: async (id: string): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await api.post<Task>("/tasks", payload);
    return data;
  },

  update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
    return data;
  },

  // Quick complete — special endpoint that also awards XP
  complete: async (id: string): Promise<{ task: Task; xpAwarded: number }> => {
    const { data } = await api.patch<{ task: Task; xpAwarded: number }>(
      `/tasks/${id}/complete`
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getStats: async (): Promise<TaskStats> => {
    const { data } = await api.get<TaskStats>("/tasks/stats");
    return data;
  },
};