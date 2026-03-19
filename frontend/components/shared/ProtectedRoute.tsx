"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is done, then redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // While checking auth state — show spinner
  if (isLoading) {
    return <Loader fullScreen text="Loading your LifeOS..." />;
  }

  // Not authenticated — show nothing (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated — render the children
  return <>{children}</>;
}