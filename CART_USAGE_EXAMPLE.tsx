/**
 * Example component demonstrating cart API usage
 * This file is for reference only - not part of the application
 */

"use client";

import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";

// Example 1: Using the useCart hook (Recommended)
export function CartExample() {
  const { 
    cart, 
    isLoading, 
    error, 
    addItem, 
    updateItem, 
    removeItem, 
    clearCart 
  } = useCart();

  const handleAddProduct = async () => {
    const result = await addItem({
      product_id: "product-123",
      quantity: 1,
      // Add any additional product data needed
      name: "Sample Product",
      price: 99.99,
    });

    if (result.success) {
      alert("Product added to cart!");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    const result = await updateItem(productId, newQuantity);
    if (result.success) {
      console.log("Quantity updated");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const result = await removeItem(productId);
    if (result.success) {
      console.log("Item removed");
    }
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      const result = await clearCart();
      if (result.success) {
        alert("Cart cleared!");
      }
    }
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Cart ({cart?.count || 0} items)
      </h2>

      <div className="space-y-4">
        {cart?.items?.map((item) => (
          <div key={item.product_id} className="flex items-center gap-4 border p-4 rounded">
            <div className="flex-1">
              <p className="font-semibold">{item.product_id}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
              >
                +
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
              >
                -
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveItem(item.product_id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={handleAddProduct}>
          Add Sample Product
        </Button>
        <Button variant="destructive" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>
    </div>
  );
}

// Example 2: Direct API usage (for advanced use cases)
import { 
  addItemToCart, 
  fetchCartItems,
  updateCartItem,
  deleteCartItem 
} from "@/lib/cart-api";
import { useAuth } from "@/lib/auth/context";

export function DirectAPIExample() {
  const { tokens } = useAuth();
  const token = tokens?.authToken || null;

  const handleDirectAdd = async () => {
    try {
      const result = await addItemToCart(
        {
          product_id: "product-456",
          quantity: 2,
        },
        token
      );
      console.log("Added:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDirectFetch = async () => {
    try {
      const cart = await fetchCartItems(token);
      console.log("Cart:", cart);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDirectUpdate = async () => {
    try {
      const result = await updateCartItem(
        "product-456",
        { quantity: 5 },
        token
      );
      console.log("Updated:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDirectDelete = async () => {
    try {
      const result = await deleteCartItem("product-456", token);
      console.log("Deleted:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Direct API Usage</h2>
      <div className="flex gap-2">
        <Button onClick={handleDirectAdd}>Add Item</Button>
        <Button onClick={handleDirectFetch}>Fetch Cart</Button>
        <Button onClick={handleDirectUpdate}>Update Item</Button>
        <Button onClick={handleDirectDelete}>Delete Item</Button>
      </div>
    </div>
  );
}

// Example 3: Add to Cart button in Product Card
export function ProductAddToCartButton({ 
  productId, 
  productName, 
  productPrice 
}: { 
  productId: string; 
  productName: string; 
  productPrice: number;
}) {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = async () => {
    const result = await addItem({
      product_id: productId,
      quantity: 1,
      name: productName,
      price: productPrice,
    });

    if (result.success) {
      // Show success toast/notification
      console.log("Added to cart!");
    } else {
      // Show error toast/notification
      console.error("Failed to add to cart:", result.error);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
