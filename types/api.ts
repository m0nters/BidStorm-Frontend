// API Response Types

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

// Helper type guards
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiError(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}
