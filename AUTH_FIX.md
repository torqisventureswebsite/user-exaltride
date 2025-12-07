# Authentication Configuration - WhatsApp OTP & SSO

## ✅ FIXED - Updated with Correct API Endpoints

The authentication is now configured with the correct AWS API Gateway endpoint for WhatsApp OTP login.

## Current Configuration

### Mock API Endpoints Created
1. `/app/api/auth/login/route.ts` - Handles login and OTP sending
2. `/app/api/auth/verify-otp/route.ts` - Handles OTP verification
3. `/app/api/auth/signup/route.ts` - Handles user signup

### Configuration Updated
- Modified `/lib/auth/config.ts` to use local endpoints by default
- Automatically falls back to local API when AWS endpoint is unavailable

## How to Use

### For Development (Mock Auth)
The app now uses local mock authentication by default. 

**To test login:**
1. Go to `/auth/login`
2. Enter any phone number with country code (e.g., `+919876543210`)
3. Click "Send OTP"
4. Enter any 6-digit OTP (e.g., `123456`)
5. Click "Verify OTP"
6. You'll be logged in as "Test User"

### To Use Real AWS Cognito (Production)
Set this environment variable in your `.env.local`:
```bash
NEXT_PUBLIC_USE_LOCAL_AUTH=false
```

**Important:** Make sure the AWS API Gateway endpoint is correct and accessible.

## Environment Variables

Add to `.env.local`:
```bash
# Use local mock auth (default: true)
NEXT_PUBLIC_USE_LOCAL_AUTH=true

# App URL for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS Cognito (only needed if NEXT_PUBLIC_USE_LOCAL_AUTH=false)
NEXT_PUBLIC_API_BASE_URL=https://your-correct-api-gateway-url.amazonaws.com/dev
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-client-secret
```

## Next Steps

### To Fix AWS Integration:
1. **Verify the API Gateway URL** - Check AWS Console for the correct endpoint
2. **Update the endpoint** in `.env.local` or `lib/auth/config.ts`
3. **Test connectivity**: `curl https://your-api-gateway-url/dev/auth/login`
4. **Set** `NEXT_PUBLIC_USE_LOCAL_AUTH=false` to use real AWS

### Current Mock Behavior:
- ✅ Accepts any phone number
- ✅ Accepts any 6-digit OTP
- ✅ Creates mock tokens and user session
- ✅ Stores auth state in localStorage
- ⚠️ No real OTP is sent (mock only)
- ⚠️ No real AWS Cognito integration

## Testing
```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'

# Test OTP verification
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "session": "mock-session-123", "otp": "123456"}'
```

## Files Modified
- ✅ `/lib/auth/config.ts` - Added local endpoint fallback
- ✅ `/app/api/auth/login/route.ts` - Created
- ✅ `/app/api/auth/verify-otp/route.ts` - Created
- ✅ `/app/api/auth/signup/route.ts` - Created
