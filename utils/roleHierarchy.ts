export type UserRole = "BIDDER" | "SELLER" | "ADMIN";

// Define role hierarchy: BIDDER < SELLER < ADMIN
const ROLE_HIERARCHY: Record<UserRole, number> = {
  BIDDER: 1,
  SELLER: 2,
  ADMIN: 3,
};

/**
 * Check if a user role has permission based on role hierarchy
 * A higher role automatically has all permissions of lower roles
 *
 * @param userRole - The role of the current user
 * @param requiredRole - The minimum required role
 * @returns true if user role meets or exceeds the required role
 *
 * @example
 * hasRolePermission("ADMIN", "SELLER") // true - Admin has Seller permissions
 * hasRolePermission("SELLER", "SELLER") // true - Exact match
 * hasRolePermission("BIDDER", "SELLER") // false - Bidder lacks Seller permissions
 */
export function hasRolePermission(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has permission for any of the allowed roles
 *
 * @param userRole - The role of the current user
 * @param allowedRoles - Array of roles that are allowed
 * @returns true if user role meets or exceeds any of the allowed roles
 *
 * @example
 * hasAnyRolePermission("ADMIN", ["SELLER"]) // true
 * hasAnyRolePermission("SELLER", ["SELLER", "BIDDER"]) // true
 * hasAnyRolePermission("BIDDER", ["SELLER"]) // false
 */
export function hasAnyRolePermission(
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean {
  return allowedRoles.some((role) => hasRolePermission(userRole, role));
}

/**
 * Get all roles that meet or exceed the minimum required role
 *
 * @param minimumRole - The minimum required role
 * @returns Array of roles that have permission
 *
 * @example
 * getAuthorizedRoles("SELLER") // ["SELLER", "ADMIN"]
 * getAuthorizedRoles("BIDDER") // ["BIDDER", "SELLER", "ADMIN"]
 * getAuthorizedRoles("ADMIN") // ["ADMIN"]
 */
export function getAuthorizedRoles(minimumRole: UserRole): UserRole[] {
  const minLevel = ROLE_HIERARCHY[minimumRole];
  return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter(
    (role) => ROLE_HIERARCHY[role] >= minLevel,
  );
}
