import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { OtpRequest } from "@/types/otp";
import { api } from "../api/fetch";

/**
 * Register new user
 * POST /api/v1/auth/register
 * Returns void - OTP will be sent to email for verification
 */
export const register = async (data: RegisterRequest) => {
  const response = await api.post<void>("/auth/register", data, {
    cache: "no-store",
  });
  return response;
};

/**
 * Verify OTP
 * POST /api/v1/auth/verify-otp
 * Returns void - activates the user account
 */
export const verifyEmailOtp = async (data: OtpRequest) => {
  const response = await api.post<void>("/auth/verify-email-otp", data, {
    cache: "no-store",
  });
  return response;
};

/**
 * Resend OTP
 * POST /api/v1/auth/resend-otp
 * with request param as email
 * Returns void - OTP will be resent to email
 */
export const resendEmailVerificationOtp = async (email: string) => {
  const response = await api.post<void>(
    `/auth/resend-email-verification-otp?email=${encodeURIComponent(email)}`,
    {},
    {
      cache: "no-store",
    },
  );
  return response;
};

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

/**
 * Forgot password - Send OTP to email
 * POST /api/v1/auth/forgot-password
 * Request body: { email: string }
 */
export const forgotPassword = async (email: string) => {
  const response = await api.post<void>(
    "/auth/forgot-password",
    { email },
    {
      cache: "no-store",
    },
  );
  return response;
};

/**
 * Verify reset password OTP
 * POST /api/v1/auth/verify-reset-password-otp
 * Request body: { email: string, otpCode: string }
 */
export const verifyResetPasswordOtp = async (data: OtpRequest) => {
  const response = await api.post<void>(
    "/auth/verify-reset-password-otp",
    data,
    {
      cache: "no-store",
    },
  );
  return response;
};

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 * Request body: { email: string, newPassword: string }
 */
export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post<void>(
    "/auth/reset-password",
    { email, newPassword },
    {
      cache: "no-store",
    },
  );
  return response;
};
