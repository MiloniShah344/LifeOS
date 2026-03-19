import { clsx } from "clsx";
import type { Priority } from "@/types/common.types";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
}

const config: Record<Priority, { label: string; color: string; dot: string }> = {
  low:    { label: "Low",    color: "bg-slate-100  text-slate-600",   dot: "bg-slate-400" },
  medium: { label: "Medium", color: "bg-blue-100   text-blue-700",    dot: "bg-blue-500" },
  high:   { label: "High",   color: "bg-orange-100 text-orange-700",  dot: "bg-orange-500" },
  urgent: { label: "Urgent", color: "bg-red-100    text-red-700",     dot: "bg-red-500" },
};

export default function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const { label, color, dot } = config[priority];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        color,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {label}
    </span>
  );
}