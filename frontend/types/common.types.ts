// Reusable types shared across modules

export type Priority = "low" | "medium" | "high" | "urgent";

export type Status = "pending" | "in_progress" | "completed" | "cancelled";

export type Frequency = "daily" | "weekly" | "monthly";

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// API error shape from NestJS
export interface ApiError {
  message: string | string[];
  statusCode: number;
  error: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}