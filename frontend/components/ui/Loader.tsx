import { clsx } from "clsx";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ size = "md", text, fullScreen = false }: LoaderProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={clsx(
          "rounded-full border-slate-200 border-t-indigo-600 animate-spin",
          sizes[size]
        )}
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}