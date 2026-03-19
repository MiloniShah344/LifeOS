"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCredentials, logout as logoutAction, setLoading } from "@/store/slices/authSlice";
import { authApi } from "@/services/auth.api";
import type { LoginPayload, RegisterPayload } from "@/types/auth.types";

// Token key in localStorage
const TOKEN_KEY = "lifeos_token";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Select from Redux store
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // On app startup: check localStorage for a saved token and re-authenticate
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      dispatch(setLoading(false));
    }
    // If token exists, the getMe query below will handle it
  }, [dispatch]);

  // Auto-fetch user if token exists in localStorage but Redux state is empty
  // This handles page refreshes — Redux state is lost but localStorage persists
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) throw new Error("No token");
      const user = await authApi.getMe();
      dispatch(
        setCredentials({
          user,
          token: savedToken,
        })
      );
      return user;
    },
    // Only run if we have a saved token but no user in Redux
    // enabled: !isAuthenticated && !!localStorage.getItem(TOKEN_KEY),
    // retry: false, // Don't retry — if it fails, the token is bad
    // onError: () => {
    //   // Token is invalid or expired — clean up
    //   localStorage.removeItem(TOKEN_KEY);
    //   dispatch(setLoading(false));
    // },
  });
  useEffect(() => {
  if (query.isError) {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(setLoading(false));
  }
}, [query.isError, dispatch]);

  // LOGIN mutation
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      // Save token to localStorage (persists across browser refreshes)
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      // Save user + token to Redux (available synchronously in-app)
      dispatch(setCredentials({ user: data.user, token: data.accessToken }));
      // Navigate to dashboard
      router.push("/dashboard");
    },
  });

  // REGISTER mutation
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      dispatch(setCredentials({ user: data.user, token: data.accessToken }));
      router.push("/dashboard");
    },
  });

  // LOGOUT — clear everything
  const logout = useCallback(async () => {
    await authApi.logout();
    localStorage.removeItem(TOKEN_KEY);
    dispatch(logoutAction());
    // Clear all cached query data (tasks, habits, etc.)
    queryClient.clear();
    router.push("/auth/login");
  }, [dispatch, queryClient, router]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    // Mutations
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoginLoading: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    isRegisterLoading: registerMutation.isPending,
    // Actions
    logout,
  };
}