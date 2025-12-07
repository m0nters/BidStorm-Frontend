// Export all API related modules

// Axios-based API (for Client Components, real-time updates, interceptors)
export { default as api } from "./client";
export {
  API_BASE_URL,
  default as apiClient,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./config";

// Next.js fetch-based API (for Server Components, caching, revalidation)
export { default as fetchApi } from "./fetch";

// Export API services
export * from "./services/categories";
export * from "./services/products";
