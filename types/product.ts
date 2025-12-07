export interface ProductListResponse {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  currentPrice: number;
  buyNowPrice?: number;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  sellerRating: number;
  highestBidderId?: number;
  highestBidderName?: string;
  highestBidderRating?: number;
  bidCount: number;
  createdAt: string;
  endTime: string;
  isNew: boolean;
  hasBuyNow: boolean;
  allowUnratedBidders: boolean;
}
