"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { removeToast } from "@/store/slices/uiSlice";
import { clsx } from "clsx";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <XCircle    className="w-5 h-5 text-red-500" />,
  info:    <Info       className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const toastStyles = {
  success: "border-emerald-100 bg-emerald-50",
  error:   "border-red-100    bg-red-50",
  info:    "border-blue-100   bg-blue-50",
  warning: "border-amber-100  bg-amber-50",
};

export default function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onDismiss: () => void;
}) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto",
        "animate-slide-up",
        toastStyles[type]
      )}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm text-slate-700 flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}