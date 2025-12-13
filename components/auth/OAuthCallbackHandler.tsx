"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { authService } from "@/lib/auth/service";

export function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Only handle if there's a code or error (OAuth callback)
      if (!code && !error) return;

      // Skip if we're on the /auth/callback page (let that page handle it)
      if (pathname === "/auth/callback") return;

      if (error) {
        console.error("OAuth error:", error, errorDescription);
        window.location.href = "/auth/login?error=" + encodeURIComponent(errorDescription || error);
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
  }, [searchParams, pathname]);

  return null;
}
