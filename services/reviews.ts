import { api } from "@/api/fetch";
import {
  CreateReviewRequest,
  PaginatedResponse,
  ReviewResponse,
  RevieweeProfileResponse,
  UpdateReviewRequest,
} from "@/types";

/**
 * Get reviewee profile for a product (person to be reviewed)
 */
export const getRevieweeProfile = async (productId: number) => {
  const response = await api.get<RevieweeProfileResponse>(
    `/profile/reviewee/${productId}`,
    { auth: true },
  );
  return response.data;
};

/**
 * Get user's review for a specific product (returns null if no review exists)
 */
export const getUserReviewForProduct = async (productId: number) => {
  const response = await api.get<ReviewResponse | null>(
    `/profile/reviews/product/${productId}`,
    { auth: true, cache: "no-store" },
  );
  return response.data;
};

/**
 * Get paginated list of user's reviews (reviews received by the user)
 */
export const getUserReviews = async (page = 0, size = 10) => {
  const response = await api.get<PaginatedResponse<ReviewResponse>>(
    `/profile/reviews?page=${page}&size=${size}`,
    { auth: true, cache: "no-store" },
  );
  return response.data;
};

/**
 * Get paginated list of reviews given by the user (where user is the reviewer)
 */
export const getGivenReviews = async (page = 0, size = 10) => {
  const response = await api.get<PaginatedResponse<ReviewResponse>>(
    `/profile/reviews/given?page=${page}&size=${size}`,
    { auth: true, cache: "no-store" },
  );
  return response.data;
};

/**
 * Create a new review
 */
export const createReview = async (request: CreateReviewRequest) => {
  await api.post("/profile/reviews", request, {
    auth: true,
    cache: "no-store",
  });
};

/**
 * Update an existing review
 */
export const updateReview = async (
  productId: number,
  request: UpdateReviewRequest,
) => {
  await api.put(`/profile/reviews/${productId}`, request, {
    auth: true,
    cache: "no-store",
  });
};

/**
 * Delete a review
 */
export const deleteReview = async (productId: number) => {
  await api.delete(`/profile/reviews/${productId}`, {
    auth: true,
    cache: "no-store",
  });
};
