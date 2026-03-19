"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/store";
import { addToast } from "@/store/slices/uiSlice";

export function useToast() {
  const dispatch = useAppDispatch();

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
      dispatch(addToast({ message, type }));
    },
    [dispatch]
  );

  return {
    success: (msg: string) => toast(msg, "success"),
    error:   (msg: string) => toast(msg, "error"),
    info:    (msg: string) => toast(msg, "info"),
    warning: (msg: string) => toast(msg, "warning"),
  };
}