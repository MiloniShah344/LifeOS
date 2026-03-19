"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

// Define every possible variant upfront with TypeScript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// forwardRef lets parent components attach a ref to this button (needed for MUI compatibility)
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl " +
      "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      "disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 " +
        "shadow-sm shadow-indigo-200",
      secondary:
        "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 " +
        "focus:ring-slate-300",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm shadow-red-200",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-8",
      md: "text-sm px-4 py-2 h-10",
      lg: "text-base px-6 py-3 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Spinner shown when loading */}
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;