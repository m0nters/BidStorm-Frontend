import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  isApiSuccess,
} from "@/types/api";
import { getAccessToken } from "./config";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
export const API_VERSION = "/api/v1";
export const API_FULL_URL = `${API_BASE_URL}${API_VERSION}`;

/**
 * Enhanced fetch wrapper with Next.js caching and revalidation support
 * Use this for Server Components and when you need Next.js caching features
 */

interface FetchOptions extends RequestInit {
  /**
   * Next.js cache option
   * - 'force-cache': Cache the response (default)
   * - 'no-store': Don't cache, always fetch fresh data
   */
  cache?: RequestCache;

  /**
   * Next.js revalidation options
   */
  next?: {
    /**
     * Revalidate cached data after X seconds
     */
    revalidate?: number | false;

    /**
     * Tag for on-demand revalidation
     */
    tags?: string[];
  };

  /**
   * Include JWT token in Authorization header
   */
  auth?: boolean;
}

/**
 * Generic fetch request function with Next.js enhancements
 */
async function request<T>(
  method: string,
  url: string,
  options: FetchOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const { auth = false, cache, next, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
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

    const data: ApiResponse<T> = await response.json();

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
        error instanceof Error ? error.message : "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    };
    throw networkError;
  }
}

/**
 * Next.js enhanced fetch API client
 * Use this for Server Components and when you need caching/revalidation
 */
export const fetchApi = {
  /**
   * GET request with caching support
   *
   * @example
   * // Cache for 1 hour
   * const data = await fetchApi.get("/api/products", {
   *   next: { revalidate: 3600 }
   * });
   *
   * // No cache, always fresh
   * const data = await fetchApi.get("/api/products", {
   *   cache: "no-store"
   * });
   *
   * // With authentication
   * const data = await fetchApi.get("/api/user/profile", {
   *   auth: true
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
    options?: FetchOptions
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

export default fetchApi;
