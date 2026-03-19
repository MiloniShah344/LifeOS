"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Sun, Moon, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { toggleTheme } from "@/store/slices/themeSlice";
import Badge from "@/components/ui/Badge";

// Map routes to readable page titles
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks":     "Tasks",
  "/habits":    "Habits",
  "/analytics": "Analytics",
  "/settings":  "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const user = useAppSelector((state) => state.auth.user);

  // Find matching page title (handles nested routes like /tasks/123)
  const pageTitle =
    Object.entries(pageTitles).find(([route]) => pathname.startsWith(route))?.[1] ??
    "LifeOS";

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white border-b border-slate-100 flex-shrink-0">
      
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* XP badge — quick stat in navbar */}
        {user && (
          <Badge variant="xp" className="hidden sm:flex">
            ⚡ {user.xp.toLocaleString()} XP
          </Badge>
        )}

        {/* Search button (placeholder for now) */}
        <button
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications button (placeholder) */}
        <button
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      </div>
    </header>
  );
}