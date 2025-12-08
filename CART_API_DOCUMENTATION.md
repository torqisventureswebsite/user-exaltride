# Cart API Documentation

This document describes the cart API implementation that integrates with the backend cart service.

## Base URL
```
https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod
```

## API Routes

### 1. Get All Cart Items
**Endpoint:** `GET /api/cart`

**Headers:**
- `Authorization: Bearer {token}` (if user is logged in)
- `X-session-id: {guestSessionId}` (if user is not logged in)

**Response:**
```json
{
  "items": [...],
  "total": 0,
  "count": 0
}
```

---

### 2. Clear All Cart Items
**Endpoint:** `DELETE /api/cart`

**Headers:**
- `Authorization: Bearer {token}` (if user is logged in)
- `X-session-id: {guestSessionId}` (if user is not logged in)

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 3. Add Item to Cart
**Endpoint:** `POST /api/cart/items`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (if user is logged in)
- `X-session-id: {guestSessionId}` (if user is not logged in)

**Body:**
```json
{
  "product_id": "string",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart"
}
```

---

### 4. Update Cart Item
**Endpoint:** `PUT /api/cart/items/{productId}`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (if user is logged in)
- `X-session-id: {guestSessionId}` (if user is not logged in)

**Body:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated"
}
```

---

### 5. Delete Cart Item
**Endpoint:** `DELETE /api/cart/items/{productId}`

**Headers:**
- `Authorization: Bearer {token}` (if user is logged in)
- `X-session-id: {guestSessionId}` (if user is not logged in)

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 6. Merge Guest Cart with User Cart
**Endpoint:** `POST /api/cart/merge`

**Description:** Merges guest cart items with user cart after login.

**Headers (Both Required):**
- `Content-Type: application/json`
- `Authorization: Bearer {token}`
- `X-session-id: {guestSessionId}`

**Response:**
```json
{
  "success": true,
  "message": "Cart merged successfully"
}
```

---

## Implementation Files

### 1. API Routes
- `/app/api/cart/route.ts` - GET and DELETE cart
- `/app/api/cart/items/route.ts` - POST add item
- `/app/api/cart/items/[productId]/route.ts` - PUT and DELETE specific item
- `/app/api/cart/merge/route.ts` - POST merge carts

### 2. Utility Functions
- `/lib/cart-api.ts` - Client-side API utilities
  - `getGuestSessionId()` - Generate/retrieve guest session ID
  - `clearGuestSessionId()` - Clear guest session after merge
  - `getCartHeaders()` - Get appropriate headers based on auth status
  - `fetchCartItems()` - Fetch all cart items
  - `addItemToCart()` - Add item to cart
  - `updateCartItem()` - Update cart item quantity
  - `deleteCartItem()` - Delete specific item
  - `clearCart()` - Clear entire cart
  - `mergeGuestCart()` - Merge guest cart with user cart

### 3. React Hook
- `/lib/hooks/useCart.ts` - Custom React hook for cart management
  - Automatically handles guest sessions
  - Auto-merges cart on login
  - Provides loading and error states

---

## Usage Examples

### Using the React Hook

```tsx
import { useCart } from "@/lib/hooks/useCart";

function CartComponent() {
  const { cart, isLoading, error, addItem, updateItem, removeItem, clearCart } = useCart();

  const handleAddToCart = async () => {
    const result = await addItem({
      product_id: "product-123",
      quantity: 1,
    });
    
    if (result.success) {
      console.log("Item added!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cart Items: {cart?.count}</h2>
      {/* Render cart items */}
    </div>
  );
}
```

### Direct API Usage

```tsx
import { addItemToCart, getGuestSessionId } from "@/lib/cart-api";
import { useAuth } from "@/lib/auth/context";

function ProductCard({ product }) {
  const { tokens } = useAuth();
  const token = tokens?.authToken;

  const handleAddToCart = async () => {
    try {
      await addItemToCart(
        {
          product_id: product.id,
          quantity: 1,
        },
        token
      );
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
}
```

---

## Guest Session Management

### How It Works
1. When a user is not logged in, a unique guest session ID is generated and stored in `localStorage`
2. The guest session ID is sent with all cart API requests via the `X-session-id` header
3. When the user logs in, the cart is automatically merged using the `/api/cart/merge` endpoint
4. After successful merge, the guest session ID is cleared from `localStorage`

### Guest Session ID Format
```
guest_{timestamp}_{randomString}
```

Example: `guest_1701234567890_abc123xyz`

---

## Error Handling

All API routes return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

## Testing

### Test with cURL

**Get Cart (Guest):**
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "X-session-id: guest_1701234567890_abc123xyz"
```

**Add Item (Logged In):**
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"product_id": "product-123", "quantity": 1}'
```

**Merge Cart:**
```bash
curl -X POST http://localhost:3000/api/cart/merge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-session-id: guest_1701234567890_abc123xyz"
```

---

## Notes

1. **Session Persistence:** Guest sessions are stored in `localStorage` and persist across page reloads
2. **Auto-Merge:** The `useCart` hook automatically triggers cart merge when a user logs in
3. **Error Recovery:** All API functions include error handling and return consistent error objects
4. **Type Safety:** TypeScript interfaces are provided for all cart-related data structures
