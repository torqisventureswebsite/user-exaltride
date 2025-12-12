"use client";

import { authEndpoints, cognitoConfig } from "./config";
import type {
  SignupData,
  LoginData,
  VerifyOtpData,
  AuthTokens,
  LoginResponse,
  SignupResponse,
  VerifyOtpResponse,
  User,
} from "./types";

// Local storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  ID_TOKEN: "idToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

class AuthService {
  // Sign up a new user
  async signup(data: SignupData): Promise<SignupResponse> {
    try {
      const response = await fetch(authEndpoints.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("Signup API error:", result);
        throw new Error(result.error || result.message || "Signup failed");
      }

      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Login user (sends OTP)
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(authEndpoints.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Login API error response:", error);
        throw new Error(error.message || error.error || `Login failed (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Verify OTP and get tokens
  async verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse> {
    try {
      const response = await fetch(authEndpoints.verifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP verification failed");
      }

      const result = await response.json();
      console.log("Verify OTP API response:", JSON.stringify(result, null, 2));

      // Map token fields - API may return accessToken or authToken
      const authToken = result?.accessToken || result?.authToken;
      const idToken = result?.idToken;
      const refreshToken = result?.refreshToken;

      const isValidToken = (v: unknown) =>
        typeof v === "string" && v.trim() !== "" && v !== "undefined" && v !== "null";

      if (!isValidToken(authToken) || !isValidToken(idToken) || !isValidToken(refreshToken)) {
        this.clearTokens();
        throw new Error(result?.message || "Invalid OTP");
      }
      
      // Store tokens and user data
      this.setTokens({
        authToken,
        idToken,
        refreshToken,
      });

      return result;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  }

  // SSO Login with Google
  initiateGoogleSSO(): void {
    const params = new URLSearchParams({
      client_id: cognitoConfig.clientId ?? "",
      response_type: "code",
      scope: "email openid profile",
      redirect_uri: cognitoConfig.redirectUri,
      identity_provider: "Google",
    });

    window.location.href = `${authEndpoints.authorize}?${params.toString()}`;
  }

  // Exchange authorization code for tokens (SSO callback)
  async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
    try {
      // Send code to server-side proxy which has access to client_secret
      const response = await fetch(authEndpoints.token, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || "Token exchange failed");
      }

      const data = await response.json();
      const tokens = {
        authToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
      };

      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      console.error("Token exchange error:", error);
      throw error;
    }
  }

  // Store tokens in local storage
  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
    
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.authToken);
    localStorage.setItem(STORAGE_KEYS.ID_TOKEN, tokens.idToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  // Clear tokens from local storage (does not touch user)
  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Get tokens from local storage
  getTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;

    const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const idToken = localStorage.getItem(STORAGE_KEYS.ID_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    const isValidToken = (v: string | null) =>
      !!v && v.trim() !== "" && v !== "undefined" && v !== "null";

    if (!isValidToken(authToken) || !isValidToken(idToken) || !isValidToken(refreshToken)) {
      return null;
    }

    return {
      authToken: authToken as string,
      idToken: idToken as string,
      refreshToken: refreshToken as string,
    };
  }

  // Store user data
  setUser(user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Get user data
  getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getTokens() !== null;
  }

  // Logout user
  logout(): void {
    if (typeof window === "undefined") return;

    this.clearTokens();
    localStorage.removeItem(STORAGE_KEYS.USER);

    // Optionally redirect to Cognito logout
    // window.location.href = `${authEndpoints.logout}?client_id=${cognitoConfig.ssoClientId}&logout_uri=${cognitoConfig.logoutUri}`;
  }

  // Decode JWT token to get user info
  decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Get user info from ID token
  getUserFromToken(): User | null {
    const tokens = this.getTokens();
    if (!tokens) return null;

    const decoded = this.decodeToken(tokens.idToken);
    if (!decoded) return null;

    return {
      phoneNumber: decoded.phone_number || decoded["custom:phone_number"] || "",
      name: decoded.name || decoded.given_name || "",
      role: decoded["custom:role"] || "buyer",
      email: decoded.email,
    };
  }
}

export const authService = new AuthService();
