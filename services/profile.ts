import { PaginatedResponse } from "@/types/api";
import {
  ChangePasswordRequest,
  FavoriteProductResponse,
  UpdateProfileRequest,
  UserProfileResponse,
} from "@/types/profile";
import { api } from "../api/fetch";

/**
 * Get user profile
 * GET /api/v1/profile
 */
export const getProfile = async () => {
  const response = await api.get<UserProfileResponse>("/profile", {
    auth: true,
    cache: "no-store",
  });
  return response.data;
};

/**
 * Update user profile
 * PUT /api/v1/profile
 */
export const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await api.put<UserProfileResponse>("/profile", data, {
    auth: true,
    cache: "no-store",
  });
  return response.data;
};

/**
 * Change password
 * PUT /api/v1/profile/password
 */
export const changePassword = async (data: ChangePasswordRequest) => {
  return await api.put("/profile/password", data, {
    auth: true,
    cache: "no-store",
  });
};

/**
 * Get favorite products (paginated)
 * GET /api/v1/favorites
 */
export const getFavorites = async (page: number = 0, size: number = 12) => {
  const response = await api.get<PaginatedResponse<FavoriteProductResponse>>(
    `/profile/favorites?page=${page}&size=${size}`,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Add product to favorites
 * POST /api/v1/favorites/{productId}
 */
export const addFavorite = async (productId: number) => {
  return await api.post(`/profile/favorites/${productId}`, null, {
    auth: true,
    cache: "no-store",
  });
};

/**
 * Remove product from favorites
 * DELETE /api/v1/favorites/{productId}
 */
export const removeFavorite = async (productId: number) => {
  return await api.delete(`/profile/favorites/${productId}`, {
    auth: true,
    cache: "no-store",
  });
};

/**
 * Check if a product is in favorites
 * GET /api/v1/favorites/check/{productId}
 */
export const isFavorite = async (productId: number) => {
  const response = await api.get<boolean>(
    `/profile/favorites/check/${productId}`,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};
