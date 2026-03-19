import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        paddings[padding],
        hover && "hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}