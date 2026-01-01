"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * Authenticated Layout Component
 * Wraps pages that require authentication with loading state
 * Shows loading spinner while checking authentication
 */
export function AuthenticatedLayout({
  children,
  redirectTo = "/dang-nhap",
}: AuthenticatedLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuthStore();

  useEffect(() => {
    // Wait for auth to initialize before redirecting
    if (isInitializing) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitializing, redirectTo, router]);

  // Show loading while initializing or not authenticated
  if (isInitializing || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
