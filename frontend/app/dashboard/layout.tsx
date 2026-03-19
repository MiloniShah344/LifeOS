// This layout wraps /dashboard, /tasks, /habits, /analytics
// ALL authenticated pages share this layout
import type { Metadata } from "next";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | LifeOS",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}