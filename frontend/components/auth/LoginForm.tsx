"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ZOD SCHEMA — this is both validation AND type generation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript type FROM the Zod schema — no duplication!
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginLoading, loginError } = useAuth();

  // react-hook-form setup
  const {
    register,    // connects input to form
    handleSubmit, // wraps our submit handler with validation
    formState: { errors }, // field-level errors from Zod
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // plugs Zod into react-hook-form
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // handleSubmit from RHF calls this ONLY if validation passes
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Navigation happens inside useAuth on success
    } catch {
      // Error is stored in loginError — no need to handle here
    }
  };

  // Extract error message from API error (NestJS sends different shapes)
  const getApiErrorMessage = (error: unknown): string => {
    if (!error) return "";
    const err = error as { response?: { data?: { message?: string | string[] } } };
    const msg = err?.response?.data?.message;
    if (Array.isArray(msg)) return msg[0];
    return msg || "Something went wrong. Please try again.";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-500 text-sm mt-1">
          Sign in to continue your journey
        </p>
      </div>

      {/* API-level error (wrong password, user not found, etc.) */}
      {loginError && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {getApiErrorMessage(loginError)}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email field */}
        {/* register("email") returns: { name, ref, onChange, onBlur } — spread onto input */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" />}
          {...register("email")}
        />

        {/* Password field */}
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...register("password")}
        />

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoginLoading}
        >
          {isLoginLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-slate-50 text-slate-400">
            Don&apos;t have an account?
          </span>
        </div>
      </div>

      {/* Register link */}
      <Link href="/auth/register">
        <Button variant="secondary" fullWidth>
          Create your LifeOS
        </Button>
      </Link>
    </div>
  );
}