"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import XPBar from "@/components/gamification/XPBar";

// Navigation items — add new routes here
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true, // only highlight when path is exactly /dashboard
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: Target,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuth();

  // Check if a nav item is active
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay — clicking it closes sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
          aria-hidden
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          // Base styles — fixed on mobile, relative on desktop
          "fixed top-0 left-0 h-full z-30 flex flex-col",
          "bg-slate-900 text-white transition-all duration-300 ease-in-out",
          // Width based on open state
          sidebarOpen ? "w-64" : "w-0 lg:w-16",
          // On desktop, always show (collapsed or expanded)
          "lg:relative lg:flex"
        )}
        aria-label="Main navigation"
      >
        {/* Inner content — hidden when width is 0 */}
        <div
          className={clsx(
            "flex flex-col h-full overflow-hidden",
            !sidebarOpen && "lg:items-center" // center icons when collapsed
          )}
        >
          {/* Header */}
          <div
            className={clsx(
              "flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0",
              !sidebarOpen && "lg:justify-center lg:px-0"
            )}
          >
            {sidebarOpen ? (
              <div className="flex items-center justify-between w-full">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                  <span className="text-xl">🚀</span>
                  <span className="font-bold text-white">LifeOS</span>
                </Link>
                {/* Mobile close button */}
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="lg:hidden p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <span className="text-xl hidden lg:block">🚀</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navItems.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                    "transition-all duration-150 group relative",
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                    !sidebarOpen && "lg:justify-center lg:px-0 lg:w-10 lg:h-10"
                  )}
                  title={!sidebarOpen ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{label}</span>}

                  {/* Active indicator dot for collapsed state */}
                  {!sidebarOpen && active && (
                    <span className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="flex-shrink-0 p-3 border-t border-slate-800 space-y-3">
            {/* XP bar — only when expanded */}
            {sidebarOpen && <XPBar />}

            {/* Streak badge */}
            {sidebarOpen && user && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-orange-400">{user.streak}</span> day streak
                </span>
              </div>
            )}

            {/* User profile + logout */}
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors flex-shrink-0"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}