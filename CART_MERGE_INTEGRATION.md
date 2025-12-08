# Cart Merge Integration Guide

This guide explains how the cart merge functionality works and how to integrate it into your authentication flow.

## Automatic Merge (Recommended)

The `useCart` hook automatically handles cart merging when a user logs in. No additional code is needed!

```tsx
// In your app layout or root component
import { useCart } from "@/lib/hooks/useCart";

function App() {
  // This hook automatically merges cart on login
  const { cart } = useCart();
  
  return <YourApp />;
}
```

### How It Works

1. **Guest Shopping:**
   - User browses and adds items to cart while not logged in
   - Items are stored with a guest session ID (e.g., `guest_1701234567890_abc123xyz`)
   - Guest session ID is stored in `localStorage`

2. **User Logs In:**
   - User completes login/signup flow
   - Auth tokens are stored
   - `useCart` hook detects the login state change

3. **Automatic Merge:**
   - Hook checks if a guest session exists
   - Calls `/api/cart/merge` with both auth token and guest session ID
   - Backend merges guest cart items into user's cart
   - Guest session ID is cleared from `localStorage`

4. **Result:**
   - User sees all their previous items plus guest items
   - Cart is now associated with their account

---

## Manual Merge (Advanced)

If you need to manually trigger cart merge (e.g., custom auth flow):

```tsx
import { mergeGuestCart, getGuestSessionId } from "@/lib/cart-api";

async function handleLogin(token: string) {
  // Your login logic here...
  
  // Check if there's a guest session to merge
  const guestSessionId = getGuestSessionId();
  
  if (guestSessionId && guestSessionId.startsWith("guest_")) {
    try {
      await mergeGuestCart(token);
      console.log("Cart merged successfully!");
    } catch (error) {
      console.error("Failed to merge cart:", error);
      // Handle error - maybe show a notification
    }
  }
}
```

---

## Integration with Auth Callback

If you want to merge cart in your auth callback page:

```tsx
// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { mergeGuestCart, getGuestSessionId } from "@/lib/cart-api";

export default function AuthCallback() {
  const router = useRouter();
  const { tokens, refreshUser } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      // Process auth tokens from URL params...
      // After successful auth:
      
      refreshUser();
      
      // Merge cart if guest session exists
      if (tokens?.authToken) {
        const guestSessionId = getGuestSessionId();
        if (guestSessionId && guestSessionId.startsWith("guest_")) {
          try {
            await mergeGuestCart(tokens.authToken);
          } catch (error) {
            console.error("Cart merge failed:", error);
          }
        }
      }
      
      router.push("/");
    }
    
    handleCallback();
  }, [tokens, refreshUser, router]);

  return <div>Processing login...</div>;
}
```

---

## Testing Cart Merge

### Test Scenario 1: Guest to User

1. **As Guest:**
   ```bash
   # Add item to cart (guest)
   curl -X POST http://localhost:3000/api/cart/items \
     -H "Content-Type: application/json" \
     -H "X-session-id: guest_test_123" \
     -d '{"product_id": "product-1", "quantity": 2}'
   ```

2. **Login:**
   ```bash
   # User logs in and gets token
   # (Use your auth flow)
   ```

3. **Merge Cart:**
   ```bash
   # Merge guest cart with user cart
   curl -X POST http://localhost:3000/api/cart/merge \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "X-session-id: guest_test_123"
   ```

4. **Verify:**
   ```bash
   # Check user's cart
   curl -X GET http://localhost:3000/api/cart \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Test Scenario 2: User with Existing Cart

1. User already has items in their cart (from previous session)
2. User shops as guest and adds more items
3. User logs in
4. Both sets of items should be merged (backend handles duplicate logic)

---

## Error Handling

### Common Issues

**1. Guest Session Not Found**
```tsx
// This is normal - user might not have added items as guest
if (!guestSessionId || !guestSessionId.startsWith("guest_")) {
  console.log("No guest cart to merge");
  return;
}
```

**2. Merge API Fails**
```tsx
try {
  await mergeGuestCart(token);
} catch (error) {
  // Log error but don't block user flow
  console.error("Cart merge failed:", error);
  // Optionally show a notification
  // User can still continue shopping
}
```

**3. Token Not Available**
```tsx
if (!token) {
  console.error("Cannot merge cart: No auth token");
  return;
}
```

---

## Best Practices

1. **Non-Blocking:** Cart merge should never block the user experience. If it fails, log the error and continue.

2. **Silent Merge:** The merge should happen silently in the background. Don't show loading states to the user.

3. **Clear Guest Session:** Always clear the guest session ID after successful merge to prevent duplicate merges.

4. **Idempotent:** The merge endpoint should be idempotent - calling it multiple times with the same guest session should be safe.

5. **Error Recovery:** If merge fails, the user can still access their cart. Guest items might be lost, but this is acceptable.

---

## Backend Requirements

The backend `/v1/cart/merge` endpoint should:

1. Accept both `Authorization` and `X-session-id` headers
2. Fetch items from guest session
3. Merge with user's existing cart (handle duplicates appropriately)
4. Delete guest session after successful merge
5. Return merged cart data

Example backend logic:
```
1. Get guest cart items using X-session-id
2. Get user cart items using Authorization token
3. For each guest item:
   - If product exists in user cart: increase quantity
   - If product doesn't exist: add to user cart
4. Save merged cart to user's account
5. Delete guest cart session
6. Return merged cart
```

---

## Monitoring

Track these metrics for cart merge:

- **Merge Success Rate:** % of successful merges
- **Guest Cart Size:** Average number of items in guest carts
- **Merge Timing:** How long after login does merge occur
- **Merge Failures:** Track and alert on merge failures

---

## Security Considerations

1. **Guest Session ID Format:** Use unpredictable IDs (timestamp + random string)
2. **Session Expiry:** Guest sessions should expire after a reasonable time (e.g., 30 days)
3. **Rate Limiting:** Prevent abuse by rate limiting merge requests
4. **Validation:** Backend should validate both tokens and session IDs
