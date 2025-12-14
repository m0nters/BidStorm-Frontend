"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestGuard - Redirects authenticated users away from guest-only pages
 * Use this for login, register, forgot password pages
 */
export function GuestGuard({ children, redirectTo = "/" }: GuestGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  // Don't render children if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
