import type { Priority, Status } from "./common.types";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  deadline?: string;       // ISO date string
  completedAt?: string;
  tags: string[];
  userId: string;
  // Auto-reschedule info
  missedCount: number;     // how many times this was missed
  rescheduledTo?: string;  // new deadline after auto-reschedule
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: Priority;
  deadline?: string;
  tags?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  deadline?: string;
  tags?: string[];
}

// Used in API responses
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;   // percentage
}