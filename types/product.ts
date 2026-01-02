export interface ProductListResponse {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  allowUnratedBidders: boolean;
  autoExtend: boolean;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
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
}

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
  highestBidderName?: string;
  highestBidderRating?: number;
  winnerName?: string;
  winnerRating?: number;
  bidCount: number;
  viewCount: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isEnded: boolean;
  isNew: boolean;
}

export interface CommentResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  parentId?: number;
  content: string;
  createdAt: string;
  replies: CommentResponse[];
  isYourself?: boolean;
  isProductSeller?: boolean;
}

export interface CreateCommentRequest {
  productId: number;
  parentId?: number;
  content: string;
}

export interface CreateProductRequest {
  categoryId: number;
  title: string;
  description: string;
  startingPrice: number;
  priceStep: number;
  buyNowPrice?: number;
  endTime: string; // ISO 8601 format
  autoExtend: boolean;
  allowUnratedBidders: boolean;
}

export interface CreateProductResponse {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  priceStep: number;
  isAutoExtend: boolean;
  startTime: string;
  endTime: string;
  createdAt: string;
  imageCount: number;
}

export interface SellerActiveProductResponse {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  endTime: string;
  createdAt: string;
  categoryName: string;
  categorySlug: string;
}

export interface SellerEndedProductResponse {
  productId: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  startingPrice: number;
  finalPrice: number;
  endTime: string;
  winnerId?: number;
  winnerName?: string;
  winnerPositiveRating?: number;
  winnerNegativeRating?: number;
  hasReviewed: boolean;
  orderStatus?: string;
  orderId?: number; // Order ID if order exists
}
