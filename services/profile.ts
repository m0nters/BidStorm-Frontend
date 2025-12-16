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
export const getFavorites = async (page: number = 0, size: number = 20) => {
  const response = await api.get<{
    content: FavoriteProductResponse[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  }>(`/favorites?page=${page}&size=${size}`, {
    auth: true,
    cache: "no-store",
  });
  return response.data;
};
