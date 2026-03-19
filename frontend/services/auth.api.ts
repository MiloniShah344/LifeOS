import api from "./api";
import type { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    // Call backend to invalidate refresh token (if implemented)
    await api.post("/auth/logout").catch(() => {
      // Silently fail — we'll clear local state regardless
    });
  },
};
