import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "xp"
  | "streak"
  | "level";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default:  "bg-slate-100 text-slate-700",
    primary:  "bg-indigo-100 text-indigo-700",
    success:  "bg-emerald-100 text-emerald-700",
    warning:  "bg-amber-100  text-amber-700",
    danger:   "bg-red-100    text-red-700",
    xp:       "bg-amber-100  text-amber-700",
    streak:   "bg-emerald-100 text-emerald-700",
    level:    "bg-purple-100 text-purple-700",
  };

  const sizes = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}