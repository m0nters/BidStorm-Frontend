// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_VERSION = "/api/v1";
export const API_FULL_URL = `${API_BASE_URL}${API_VERSION}`;

// WebSocket Configuration
export const WS_BASE_URL = `${API_BASE_URL}/ws`;

// Token management - Store in memory only for security
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};
