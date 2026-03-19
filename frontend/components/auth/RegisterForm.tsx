"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  // Cross-field validation — passwords must match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // attach error to confirmPassword field
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const strength = passed === 0 ? 0 : passed === 1 ? 33 : passed === 2 ? 66 : 100;

  const color =
    strength === 0
      ? "bg-slate-200"
      : strength <= 33
      ? "bg-red-400"
      : strength <= 66
      ? "bg-amber-400"
      : "bg-emerald-500";

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      {/* Checklist */}
      <div className="flex gap-3 flex-wrap">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={`text-xs flex items-center gap-1 ${
              pass ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <span>{pass ? "✓" : "○"}</span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser, isRegisterLoading, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // watch("password") subscribes to live password value — for the strength indicator
  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch {
      // Error handled via registerError state
    }
  };

  const getApiErrorMessage = (error: unknown): string => {
    if (!error) return "";
    const err = error as { response?: { data?: { message?: string | string[] } } };
    const msg = err?.response?.data?.message;
    if (Array.isArray(msg)) return msg[0];
    return msg || "Registration failed. Please try again.";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your LifeOS</h1>
        <p className="text-slate-500 text-sm mt-1">
          Start your journey to a more productive life
        </p>
      </div>

      {registerError && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {getApiErrorMessage(registerError)}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Your name"
          type="text"
          placeholder="Alex Johnson"
          autoComplete="name"
          error={errors.name?.message}
          leftIcon={<User className="w-4 h-4" />}
          {...register("name")}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" />}
          {...register("email")}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            {...register("password")}
          />
          {/* Live password strength meter */}
          <PasswordStrength password={passwordValue} />
        </div>

        <Input
          label="Confirm password"
          type={showConfirm ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register("confirmPassword")}
        />

        {/* Terms */}
        <p className="text-xs text-slate-400 leading-relaxed">
          By creating an account you agree to our{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</span>{" "}
          and{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isRegisterLoading}
        >
          {isRegisterLoading ? "Creating your account..." : "Create account"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-slate-50 text-slate-400">
            Already have an account?
          </span>
        </div>
      </div>

      <Link href="/auth/login">
        <Button variant="secondary" fullWidth>
          Sign in instead
        </Button>
      </Link>
    </div>
  );
}