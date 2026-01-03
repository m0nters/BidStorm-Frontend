export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: "BIDDER" | "SELLER" | "ADMIN";
  avatarUrl: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  address: string;
  birthDate?: string; // ISO date string
  recaptchaToken: string;
}

export interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
