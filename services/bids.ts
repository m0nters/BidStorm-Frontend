import { api } from "@/api/fetch";
import { BidRequest, BidResponse } from "@/types/bid";

/**
 * Place an automatic bid on a product
 */
export const placeBid = async (
  productId: number,
  request: BidRequest,
): Promise<BidResponse> => {
  const response = await api.post<BidResponse>(
    `/products/${productId}/bids`,
    request,
    {
      cache: "no-store",
      auth: true,
    },
  );
  return response.data;
};

/**
 * Get bid history for a product
 */
export const getBidHistory = async (
  productId: number,
): Promise<BidResponse[]> => {
  const response = await api.get<BidResponse[]>(`/products/${productId}/bids`, {
    cache: "no-store",
    auth: true,
  });
  return response.data;
};

/**
 * Remove a bidder from a product (seller only)
 */
export const removeBidder = async (
  productId: number,
  bidderId: number,
): Promise<void> => {
  await api.delete(`/products/${productId}/bidders/${bidderId}`, {
    auth: true,
  });
};
