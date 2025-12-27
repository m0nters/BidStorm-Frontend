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
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasPermission =
    isAuthenticated && user && hasAnyRolePermission(user.role, allowedRoles);

  useEffect(() => {
    if (isAuthenticated && user && !hasPermission) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, hasPermission, redirectTo, router]);

  // If not authenticated or role not allowed
  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
