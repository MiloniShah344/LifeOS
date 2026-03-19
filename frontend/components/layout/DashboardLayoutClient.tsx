"use client";

import { useAppSelector } from "@/store/store";
import { clsx } from "clsx";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import ToastContainer from "@/components/shared/ToastContainer";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page content — scrollable */}
          <main
            className={clsx(
              "flex-1 overflow-y-auto transition-all duration-300",
              "p-4 lg:p-6"
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Toast notifications — renders outside the layout flow */}
      <ToastContainer />
    </ProtectedRoute>
  );
}