"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "./service";
import type { AuthState, User, AuthTokens } from "./types";

interface AuthContextType extends AuthState {
  login: (phoneNumber: string) => Promise<string>;
  signup: (phoneNumber: string, name: string, role: "buyer" | "vendor" | "admin") => Promise<void>;
  verifyOtp: (phoneNumber: string, session: string, otp: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from local storage
  useEffect(() => {
    const tokens = authService.getTokens();
    const user = authService.getUser() || authService.getUserFromToken();

    setState({
      user,
      tokens,
      isAuthenticated: !!tokens,
      isLoading: false,
    });
  }, []);

  const login = async (phoneNumber: string): Promise<string> => {
    try {
      const response = await authService.login({ phoneNumber });
      return response.session;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    phoneNumber: string,
    name: string,
    role: "buyer" | "vendor" | "admin"
  ): Promise<void> => {
    try {
      await authService.signup({ phoneNumber, name, role });
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (
    phoneNumber: string,
    session: string,
    otp: string
  ): Promise<void> => {
    try {
      const response = await authService.verifyOtp({
        phoneNumber,
        session,
        otp,
      });

      const user: User = response.user || authService.getUserFromToken() || {
        phoneNumber,
        name: "",
        role: "buyer",
      };

      authService.setUser(user);

      setState({
        user,
        tokens: {
          authToken: response.authToken,
          idToken: response.idToken,
          refreshToken: response.refreshToken,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = () => {
    authService.initiateGoogleSSO();
  };

  const logout = () => {
    authService.logout();
    // Clear cart cookie on logout
    if (typeof window !== "undefined") {
      document.cookie = "cart=; path=/; max-age=0; samesite=lax";
    }
    setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshUser = () => {
    const tokens = authService.getTokens();
    const user = authService.getUser() || authService.getUserFromToken();
    
    setState({
      user,
      tokens,
      isAuthenticated: !!tokens,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        verifyOtp,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
