import { LoginRequest, LoginResponse } from "@/types/auth";
import { api } from "../fetch";

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (credentials: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", credentials, {
    cache: "no-store",
    credentials: "include", // Required to receive and store httpOnly cookie
  });
  return response.data;
};

/**
 * Refresh access token using refresh token stored in httpOnly cookie
 * POST /api/v1/auth/refresh
 *
 * Note: The refresh token is stored in an httpOnly cookie by the backend.
 * Since httpOnly cookies cannot be accessed via JavaScript, we rely on the browser
 * automatically sending the cookie with credentials: 'include'.
 * The backend should extract the refresh token from the cookie on the server side.
 */
export const refreshAccessToken = async () => {
  console.log("Refreshing access token...");
  const response = await api.post<LoginResponse>(
    "/auth/refresh",
    {},
    {
      cache: "no-store",
      credentials: "include", // Browser automatically sends httpOnly cookie
    },
  );
  return response.data;
};

/**
 * Logout user (invalidate refresh token)
 * POST /api/v1/auth/logout
 * Requires authentication (JWT access token in Authorization header)
 */
export const logout = async () => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      auth: true, // Include JWT token in Authorization header
      cache: "no-store",
      credentials: "include",
    },
  );
  return response.data;
};
