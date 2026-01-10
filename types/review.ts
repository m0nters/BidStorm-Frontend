import { PaginatedResponse } from "./api";

export interface ReviewResponse {
  id: number;
  productId: number;
  productTitle: string;
  productUrl: string;
  thumbnailUrl: string;
  isUserProduct?: boolean;
  reviewerId: number;
  reviewerName: string;
  rating: number; // 1 for positive, -1 for negative
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number; // 1 for positive, -1 for negative
  comment?: string;
}

export interface UpdateReviewRequest {
  rating: number; // 1 for positive, -1 for negative
  comment?: string;
}

export interface UserReviewsWithMetadataResponse {
  positiveRating: number;
  negativeRating: number;
  ratingPercentage: number;
  totalRatings: number;
  reviews: PaginatedResponse<ReviewResponse>;
}
