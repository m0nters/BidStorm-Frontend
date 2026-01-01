// Future implementation: Order history for profile pages

/**
 * This file contains type definitions and service stubs for future order history feature.
 * These will be needed when implementing the order history section in user profiles.
 */

/**
 * Filter options for order history
 */
export type OrderFilterStatus =
  | "ALL"
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED";

/**
 * Order list item for history display
 */
export interface OrderListItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  amount: number;
  status: string;
  otherPartyName: string; // Seller name for buyer, Winner name for seller
  createdAt: string;
  completedAt: string | null;
}

/**
 * Paginated order history response
 */
export interface OrderHistoryResponse {
  content: OrderListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Future API endpoints to implement:
 *
 * GET /api/orders/buyer - Get orders where user is buyer
 * GET /api/orders/seller - Get orders where user is seller
 *
 * Query params:
 * - page: number
 * - size: number
 * - status: OrderFilterStatus
 * - sort: "createdAt,desc" | "createdAt,asc"
 */

// Example service implementation (to be created later):
/*
export const getBuyerOrders = async (
  page = 0,
  size = 10,
  status?: OrderFilterStatus
): Promise<OrderHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(status && status !== "ALL" && { status }),
  });

  const response = await api.get<OrderHistoryResponse>(
    `/orders/buyer?${params}`,
    { auth: true, cache: "no-store" }
  );
  return response.data;
};

export const getSellerOrders = async (
  page = 0,
  size = 10,
  status?: OrderFilterStatus
): Promise<OrderHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(status && status !== "ALL" && { status }),
  });

  const response = await api.get<OrderHistoryResponse>(
    `/orders/seller?${params}`,
    { auth: true, cache: "no-store" }
  );
  return response.data;
};
*/

/**
 * Component structure for profile pages:
 *
 * components/profile/orders/
 *   OrderHistorySection.tsx - Main container
 *   OrderListItem.tsx - Individual order card
 *   OrderFilters.tsx - Filter and sort controls
 *
 * UI should show:
 * - Product image and title
 * - Order status badge
 * - Amount paid
 * - Other party name (buyer/seller)
 * - Date created
 * - "View Details" button → /san-pham/{slug}/hoan-tat-don-hang
 */
