import { ApiResponse, ApiSuccessResponse, isApiSuccess } from "@/types/api";
import { AxiosRequestConfig } from "axios";
import apiClient from "./config";

/**
 * Generic API request function
 * Automatically handles response structure and errors
 */
async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });

    if (isApiSuccess(response.data)) {
      return response.data;
    }

    // This shouldn't happen if backend is consistent, but just in case
    throw response.data;
  } catch (error) {
    // Error is already processed by interceptor
    throw error;
  }
}

/**
 * API Client Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return request<T>("GET", url, undefined, config);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request<T>("POST", url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request<T>("PUT", url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request<T>("PATCH", url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return request<T>("DELETE", url, undefined, config);
  },

  /**
   * Upload file with multipart/form-data
   */
  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ) => {
    return request<T>("POST", url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  },
};

export default api;
