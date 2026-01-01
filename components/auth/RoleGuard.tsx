"use client";

import { useAuthStore } from "@/store/authStore";
import { hasAnyRolePermission, UserRole } from "@/utils/roleHierarchy";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Role-based Access Guard Component
 * Restricts access based on user role with automatic hierarchy support
 * Higher roles automatically have permissions of lower roles:
 * BIDDER < SELLER < ADMIN
 *
 * @example
 * // Admin automatically has access to Seller-only pages
 * <RoleGuard allowedRoles={["SELLER"]}>...</RoleGuard>
 *
 * Redirects or shows fallback if user doesn't have required role
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/403",
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitializing } = useAuthStore();

  const hasPermission =
    isAuthenticated && user && hasAnyRolePermission(user.role, allowedRoles);

  useEffect(() => {
    // Wait for auth to initialize before checking permissions
    if (isInitializing) return;

    if (isAuthenticated && user && !hasPermission) {
      router.push(redirectTo);
    }
  }, [
    isAuthenticated,
    isInitializing,
    user,
    hasPermission,
    redirectTo,
    router,
  ]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or role not allowed
  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
