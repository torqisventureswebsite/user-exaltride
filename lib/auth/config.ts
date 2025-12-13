// Auto-detect the base URL - works on both client and server
function getBaseUrl() {
  // Client-side: always use window.location.origin to ensure same-origin requests
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Server-side: check for explicit env var
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback for local development
  return "http://localhost:3000";
}

// WhatsApp OTP API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev";

// AWS Cognito Configuration for Google SSO
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "exaltride-auth.auth.ap-south-1.amazoncognito.com";

export const cognitoConfig = {
  // Google SSO client credentials
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  
  // Cognito domain
  domain: COGNITO_DOMAIN,
  
  // Redirect URI for Google SSO - must match exactly what's configured in Cognito
  get redirectUri() {
    return process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "https://exaltride.com";
  },
  get logoutUri() {
    return getBaseUrl();
  },
};

// Auth API endpoints
export const authEndpoints = {
  // WhatsApp OTP endpoints (via proxy to bypass CORS)
  get signup() {
    return `${getBaseUrl()}/api/proxy/auth/signup`;
  },
  get login() {
    return `${getBaseUrl()}/api/proxy/auth/login`;
  },
  get verifyOtp() {
    return `${getBaseUrl()}/api/proxy/auth/verify-otp`;
  },
  
  // Cognito hosted UI endpoints for Google SSO
  get authorize() {
    return `https://${COGNITO_DOMAIN}/oauth2/authorize`;
  },
  get token() {
    // Use proxy to bypass CORS
    return `${getBaseUrl()}/api/proxy/auth/token`;
  },
  get logout() {
    return `https://${COGNITO_DOMAIN}/logout`;
  },
};
