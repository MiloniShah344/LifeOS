"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;         // error message shown below input
  hint?: string;          // helper text shown below input
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate id from label if not provided (for accessibility)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-hidden>*</span>
            )}
          </label>
        )}

        {/* Input wrapper — needed for icon positioning */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900",
              "placeholder:text-slate-400 transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
              // Error state styling
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-200 hover:border-slate-300",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            aria-invalid={!!error}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-500 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Hint text */}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;