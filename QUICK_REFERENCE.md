# 🚀 ExaltRide - Quick Reference

## 📡 Active API Endpoints

### WhatsApp OTP Authentication
```
https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev

POST /auth/signup       - Register user
POST /auth/login        - Send OTP
POST /auth/verify-otp   - Verify OTP
```

### Products & Data
```
https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1

GET  /products          - All products
GET  /products/{slug}   - Single product
GET  /products/featured - Featured products
GET  /categories        - All categories
GET  /brands            - All brands
```

---

## 🔐 SSO Configuration

### Redirect URLs (for AWS Cognito/Google)
```
Development:
  Callback: http://localhost:3000/auth/callback
  Logout:   http://localhost:3000

Production:
  Callback: https://yourdomain.com/auth/callback
  Logout:   https://yourdomain.com
```

### Cognito Details
```
Domain:         exaltride-auth.auth.ap-south-1.amazoncognito.com
SSO Client ID:  24vle4l58riamcdce2lh1imn35
Region:         ap-south-1
```

---

## 🧪 Quick Test Commands

### Test WhatsApp OTP
```bash
# Send OTP
curl -X POST https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Test Products API
```bash
curl https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/products?limit=5
```

---

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Format code
pnpm format
```

---

## 📂 Key Files

### Authentication
- `/lib/auth/config.ts` - Auth configuration
- `/lib/auth/service.ts` - Auth service
- `/lib/auth/context.tsx` - Auth context
- `/app/auth/login/page.tsx` - Login page
- `/app/auth/callback/page.tsx` - OAuth callback

### API Integration
- `/lib/api/products.ts` - Products API
- `/lib/api/categories.ts` - Categories API
- `/lib/api/brands.ts` - Brands API

### Cart
- `/lib/cart-actions.ts` - Cart server actions
- `/app/cart/page.tsx` - Cart page

---

## 🔧 Environment Variables

```bash
# Use real WhatsApp OTP (default)
# NEXT_PUBLIC_USE_LOCAL_AUTH=false

# Use mock auth for testing
NEXT_PUBLIC_USE_LOCAL_AUTH=true

# API endpoints
NEXT_PUBLIC_API_BASE_URL=https://k8he8cx9he.execute-api.ap-south-1.amazonaws.com/dev
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

## ✅ Implementation Status

| Feature | Status |
|---------|--------|
| Homepage with products | ✅ |
| Search & filters | ✅ |
| Product details | ✅ |
| Cart management | ✅ |
| WhatsApp OTP login | ✅ |
| Google SSO | ✅ |
| Checkout form | ✅ |
| Payment integration | ❌ |
| Order tracking | ❌ |
| Order history | ❌ |

---

## 📞 Quick Links

- **Dev Server:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Cart:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout

---

**For detailed documentation, see `AUTH_SETUP_COMPLETE.md`**
