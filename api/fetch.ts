import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  isApiSuccess,
} from "@/types/api";
import { API_FULL_URL, clearAccessToken, getAccessToken } from "./config";

interface FetchOptions extends RequestInit {
  /**
   * Include JWT token in Authorization header
   */
  auth?: boolean;

  /**
   * Next.js cache option
   */
  cache?: RequestCache;

  /**
   * Next.js revalidation options
   */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Generic API request function
 * Automatically handles response structure, errors, and authentication
 */
async function request<T>(
  method: string,
  url: string,
  options: FetchOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { auth = false, cache, next, ...fetchOptions } = options;

  // Don't set Content-Type for FormData - let browser set it with boundary
  const headers: HeadersInit = {
    ...(fetchOptions.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  };

  // Add JWT token if auth is required
  if (auth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const fullUrl = `${API_FULL_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      ...fetchOptions,
      headers,
      cache,
      next,
    });

    // Handle 403 with no JSON response (Spring Boot default forbidden page)
    if (response.status === 403) {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const forbiddenError: ApiErrorResponse = {
          success: false,
          status: 403,
          error: "Forbidden",
          message: "Người dùng không đủ thẩm quyền thực hiện hành động này",
          timestamp: new Date().toISOString(),
        };
        throw forbiddenError;
      }
    }

    const data: ApiResponse<T> = await response.json();

    // Handle 401 Unauthorized - token expired or invalid
    // Don't redirect if already on guest pages (login, register, verify-otp)
    if (response.status === 401) {
      clearAccessToken();
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const guestPages = ["/dang-nhap", "/dang-ky", "/xac-nhan-otp"];
        const isOnGuestPage = guestPages.some((page) =>
          currentPath.startsWith(page),
        );

        if (!isOnGuestPage) {
          window.location.href = "/dang-nhap";
        }
      }
    }

    if (isApiSuccess(data)) {
      return data;
    }

    // Handle API error response
    throw data;
  } catch (error) {
    // If it's already an ApiErrorResponse, throw it
    if (error && typeof error === "object" && "success" in error) {
      throw error;
    }

    // Handle network errors
    const networkError: ApiErrorResponse = {
      success: false,
      status: 0,
      error: "Network Error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please check your internet connection.",
      timestamp: new Date().toISOString(),
    };
    throw networkError;
  }
}

/**
 * API Client Methods
 */
export const api = {
  /**
   * GET request
   *
   * @example
   * // Without auth
   * const data = await api.get("/products");
   *
   * // With auth
   * const data = await api.get("/user/profile", { auth: true });
   *
   * // With Next.js caching
   * const data = await api.get("/products", {
   *   next: { revalidate: 3600 }
   * });
   */
  get: <T = any>(url: string, options?: FetchOptions) => {
    return request<T>("GET", url, options);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, body?: any, options?: FetchOptions) => {
    return request<T>("POST", url, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, body?: any, options?: FetchOptions) => {
    return request<T>("PUT", url, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, body?: any, options?: FetchOptions) => {
    return request<T>("PATCH", url, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, options?: FetchOptions) => {
    return request<T>("DELETE", url, options);
  },

  /**
   * Upload file with multipart/form-data
   */
  upload: <T = any>(
    url: string,
    formData: FormData,
    options?: FetchOptions,
  ) => {
    const { headers, ...restOptions } = options || {};
    // Don't set Content-Type for FormData, browser will set it with boundary
    const uploadHeaders = { ...headers };
    delete (uploadHeaders as any)["Content-Type"];

    return request<T>("POST", url, {
      ...restOptions,
      headers: uploadHeaders,
      body: formData,
    });
  },
};

export default api;
