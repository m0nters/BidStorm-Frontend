export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  birthDate?: string; // ISO date string (LocalDate)
  role: "BIDDER" | "SELLER" | "ADMIN";
  avatarUrl?: string;
  positiveRating: number;
  negativeRating: number;
  ratingPercentage: number;
  totalRatings: number;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO datetime string (ZonedDateTime)
}

export interface UpdateProfileRequest {
  email: string;
  fullName: string;
  address: string;
  birthDate: string; // ISO date string (LocalDate)
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface FavoriteProductResponse {
  productId: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  currentPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  endTime: string; // ISO datetime string (ZonedDateTime)
  isEnded: boolean;
  favoritedAt: string; // ISO datetime string (ZonedDateTime)
}

export interface BiddingProductResponse {
  productId: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  currentPrice: number;
  userHighestBid: number;
  isWinning: boolean;
  bidCount: number;
  endTime: string; // ISO datetime string (ZonedDateTime)
  isEnded: boolean;
}

export interface WonProductResponse {
  productId: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  winningBid: number;
  sellerId: number;
  sellerName: string;
  endTime: string; // ISO datetime string (ZonedDateTime)
  hasReviewed: boolean;
}
