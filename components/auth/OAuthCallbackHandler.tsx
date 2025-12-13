"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth/service";

export function OAuthCallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      // Only handle if there's a code or error (OAuth callback)
      if (!code && !error) return;

      if (error) {
        console.error("OAuth error:", error);
        window.location.href = "/auth/login?error=" + encodeURIComponent(error);
        return;
      }

      if (code) {
        try {
          console.log("Exchanging OAuth code for tokens...");
          // Exchange code for tokens
          await authService.exchangeCodeForTokens(code);
          
          // Get user info from token
          const user = authService.getUserFromToken();
          console.log("User from token:", user);
          if (user) {
            authService.setUser(user);
          }

          // Remove code from URL and refresh
          window.history.replaceState({}, "", "/");
          window.location.reload();
        } catch (err) {
          console.error("OAuth callback error:", err);
          const errorMessage = err instanceof Error ? err.message : "Authentication failed";
          window.location.href = "/auth/login?error=" + encodeURIComponent(errorMessage);
        }
      }
    };

    handleOAuthCallback();
  }, [searchParams]);

  return null;
}
