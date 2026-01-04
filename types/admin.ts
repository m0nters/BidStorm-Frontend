// Admin API Types

// User Management Types
export interface UserListResponse {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  positiveRating: number;
  negativeRating: number;
  isActive: boolean;
  sellerExpiresAt: string | null;
  createdAt: string;
}

export interface UserDetailResponse {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  address: string;
  birthDate: string;
  roleId: number;
  roleName: string;
  positiveRating: number;
  negativeRating: number;
  emailVerified: boolean;
  isActive: boolean;
  sellerExpiresAt: string | null;
  sellerUpgradedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// Upgrade Request Types
export interface UpgradeRequestResponse {
  id: number;
  bidderId: number;
  bidderName: string;
  bidderEmail: string;
  bidderPositiveRating: number;
  bidderNegativeRating: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminId: number | null;
  adminName: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface MyUpgradeRequestResponse {
  id: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminName: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface SubmitUpgradeRequestRequest {
  reason?: string;
}

// Statistics Types
export interface RevenueStatisticsResponse {
  totalRevenueCents: number;
  completedOrderCount: number;
  currency: string;
  averageOrderValueCents: number;
}

export interface BasicStatisticsResponse {
  newAuctionListings: number;
  newUsers: number;
  newSellerUpgrades: number;
  zeroBidProducts: number;
}

export interface CategoryRevenueItem {
  categoryId: number;
  categoryName: string;
  totalRevenueCents: number;
  productCount: number;
}

export interface PendingPaymentsInfo {
  totalPendingCents: number;
  orderCount: number;
  currency: string;
}

export interface LeaderboardUser {
  userId: number;
  fullName: string;
  email: string;
  valueCents: number;
  count: number;
}

export interface AdminStatisticsOverviewResponse {
  timePeriod: string;
  basicStatistics: BasicStatisticsResponse;
  totalRevenue: RevenueStatisticsResponse;
  categoryRevenue: CategoryRevenueItem[];
  pendingPayments: PendingPaymentsInfo;
  topBidders: LeaderboardUser[];
  topSellers: LeaderboardUser[];
}

export type TimePeriod =
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_YEAR"
  | "ALL_TIME";

// System Configuration Types
export interface SystemConfigResponse {
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

export interface UpdateSystemConfigRequest {
  value: string;
}

// Role Management Types
export interface RoleResponse {
  id: number;
  name: string;
}

export interface ChangeUserRoleRequest {
  roleId: number;
}
