import { clsx } from "clsx";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;   // e.g. 12 means +12%
    label?: string;
  };
  color?: "indigo" | "emerald" | "amber" | "purple" | "red";
}

const colors = {
  indigo: {
    icon: "bg-indigo-100 text-indigo-600",
    value: "text-indigo-700",
    trend: "text-indigo-500",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
    trend: "text-emerald-500",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
    trend: "text-amber-500",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    value: "text-purple-700",
    trend: "text-purple-500",
  },
  red: {
    icon: "bg-red-100 text-red-600",
    value: "text-red-700",
    trend: "text-red-500",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "indigo",
}: StatsCardProps) {
  const c = colors[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={clsx("text-3xl font-bold mt-1", c.value)}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={clsx(
                "text-xs font-medium mt-2 flex items-center gap-1",
                trend.value >= 0 ? "text-emerald-600" : "text-red-500"
              )}
            >
              <span>{trend.value >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}% {trend.label ?? "this week"}</span>
            </p>
          )}
        </div>
        {icon && (
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
              c.icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}