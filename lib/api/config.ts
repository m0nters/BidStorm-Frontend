import { ApiErrorResponse } from "@/types/api";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
export const API_VERSION = "/api/v1";
export const API_FULL_URL = `${API_BASE_URL}${API_VERSION}`;

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_FULL_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
};

export const clearAccessToken = () => {
  setAccessToken(null);
};

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data;

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        clearAccessToken();
        // Redirect to login page if needed
        if (typeof window !== "undefined") {
          window.location.href = "/dang-nhap";
        }
      }

      return Promise.reject(errorData);
    } else if (error.request) {
      // Request was made but no response received
      const networkError: ApiErrorResponse = {
        success: false,
        status: 0,
        error: "Network Error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiErrorResponse = {
        success: false,
        status: 0,
        error: "Unknown Error",
        message: error.message || "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(unknownError);
    }
  }
);

export default apiClient;
