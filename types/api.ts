export interface ApiSuccessResponse<T = any> {
  success: true;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  error: string;
  message: string;
  details?: ApiErrorDetail[];
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination types (matching Spring Boot Page response)
export interface PaginatedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number; // Current page number (0-indexed)
  numberOfElements: number; // Number of elements in current page
  size: number; // Page size
  totalElements: number; // Total number of elements
  totalPages: number; // Total number of pages
}

// Helper type guards
export function isApiSuccess<T>(
  response: ApiResponse<T>,
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiError(
  response: ApiResponse,
): response is ApiErrorResponse {
  return response.success === false;
}
