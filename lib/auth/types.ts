// Authentication types
export type UserRole = "buyer" | "vendor" | "admin";

export interface SignupData {
  phoneNumber: string;
  name: string;
  role: UserRole;
}

export interface LoginData {
  phoneNumber: string;
}

export interface VerifyOtpData {
  phoneNumber: string;
  session: string;
  otp: string;
}

export interface AuthTokens {
  authToken: string;
  idToken: string;
  refreshToken: string;
}

export interface User {
  phoneNumber: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  session: string;
  message?: string;
}

export interface SignupResponse {
  message: string;
  success: boolean;
}

export interface VerifyOtpResponse extends AuthTokens {
  user?: User;
  accessToken?: string; // API may return accessToken instead of authToken
}
