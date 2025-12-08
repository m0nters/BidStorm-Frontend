export interface ProductListResponse {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  currentPrice: number;
  buyNowPrice?: number;
  allowUnratedBidders: boolean;
  autoExtend: boolean;
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
}

// Product Detail Types
export interface UserBasicInfo {
  id: number;
  fullName: string;
  positiveRating: number;
  negativeRating: number;
  ratingPercentage: number;
}

export interface ProductImageResponse {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface DescriptionLogResponse {
  id: number;
  updatedContent: string;
  updatedAt: string;
}

export interface ProductDetailResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  images: ProductImageResponse[];
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  priceStep: number;
  isAutoExtend: boolean;
  allowUnratedBidders: boolean;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  parentCategoryName: string;
  parentCategorySlug: string;
  seller: UserBasicInfo;
  highestBidder?: UserBasicInfo;
  winner?: UserBasicInfo;
  bidCount: number;
  viewCount: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isEnded: boolean;
  isNew: boolean;
  hasBuyNow: boolean;
  descriptionLogs: DescriptionLogResponse[];
}
