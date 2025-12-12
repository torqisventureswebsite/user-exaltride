"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, MapPin, User, Wallet, Loader2, Plus, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useCart, CartItem } from "@/lib/cart/context";
import { toast } from "sonner";

interface CheckoutFormProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

export default function CheckoutForm({ cartItems, subtotal, shipping, tax, total }: CheckoutFormProps) {
  const router = useRouter();
  const { tokens, user } = useAuth();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  
  // Form state - pre-filled from user profile
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Pre-fill user info from profile
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses");
        if (response.ok) {
          const addresses = await response.json();
          setSavedAddresses(addresses);
          // Auto-select default address
          const defaultAddr = addresses.find((a: SavedAddress) => a.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setShowNewAddressForm(true);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Get shipping address based on selection
  const getShippingAddress = () => {
    if (selectedAddressId && !showNewAddressForm) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        const nameParts = addr.full_name.split(" ");
        return {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: formData.email,
          phone: addr.phone,
          address: [addr.address_line1, addr.address_line2, addr.landmark].filter(Boolean).join(", "),
          city: addr.city,
          state: addr.state,
          zipCode: addr.pincode,
          country: addr.country,
        };
      }
    }
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate address selection
      if (!showNewAddressForm && !selectedAddressId) {
        throw new Error("Please select a shipping address");
      }

      const shippingAddress = getShippingAddress();

      // First, verify cart has items on the backend
      console.log("Verifying backend cart...");
      
      // Build headers - use auth token if available, otherwise use guest session ID
      const cartHeaders: HeadersInit = {};
      if (tokens?.idToken) {
        cartHeaders["Authorization"] = `Bearer ${tokens.idToken}`;
      } else {
        // Fallback to guest session ID from localStorage
        const guestSessionId = typeof window !== "undefined" ? localStorage.getItem("guest_session_id") : null;
        if (guestSessionId) {
          cartHeaders["X-Session-Id"] = guestSessionId;
        }
      }
      
      const cartResponse = await fetch("/api/cart", {
        headers: cartHeaders,
      });
      const cartData = await cartResponse.json();
      console.log("Backend cart data:", JSON.stringify(cartData, null, 2));

      const backendCartItems = cartData.data || cartData.items || [];
      if (backendCartItems.length === 0) {
        throw new Error("Your cart is empty on the server. Please add items to cart again.");
      }

      // Build order request body - matching backend API format
      const orderRequestBody = {
        shippingAddress: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
          phone: shippingAddress.phone,
          address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`,
          pincode: shippingAddress.zipCode,
        },
        paymentMethod: "online",
      };

      console.log("Creating order with:", JSON.stringify(orderRequestBody, null, 2));
      
      // Debug: Log full idToken to compare with working Postman token
      console.log("Full idToken being sent:", tokens?.idToken);
      
      // Debug: Decode JWT to see the sub (user ID)
      if (tokens?.idToken) {
        try {
          const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
          console.log("Token payload (sub is buyer_id):", payload);
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }

      const orderResponse = await fetch("https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.idToken}`,
        },
        body: JSON.stringify(orderRequestBody),
      });
      console.log("Order response:", orderResponse)

      const orderData = await orderResponse.json();
      console.log("Order response:", JSON.stringify(orderData, null, 2));

      if (!orderResponse.ok) {
        const errorMsg = orderData.error || orderData.message || "Failed to create order";
        console.error("Order creation failed:", orderData);
        throw new Error(errorMsg);
      }

      const orderId = orderData.data?.orderId || orderData.orderId || orderData.id;

      if (!orderId) {
        throw new Error("Order created but no order ID returned");
      }

      // Initiate PhonePe payment using /v1/payments/initiate endpoint
      const paymentRequestBody = {
        orderId: orderId,
        callbackUrl: `${window.location.origin}/api/payments/callback`,
        redirectUrl: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
      };

      console.log("Initiating payment with:", JSON.stringify(paymentRequestBody, null, 2));

      const paymentResponse = await fetch(`/api/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.idToken}`,
        },
        body: JSON.stringify(paymentRequestBody),
      });

      const paymentData = await paymentResponse.json();
      console.log("Payment response:", JSON.stringify(paymentData, null, 2));

      if (!paymentResponse.ok) {
        const errorMsg = paymentData.error || paymentData.message || "Failed to initiate payment";
        console.error("Payment initiation failed:", paymentData);
        throw new Error(errorMsg);
      }

      // Get redirect URL from response - check multiple possible locations
      const redirectUrl = paymentData.data?.redirectUrl || paymentData.redirectUrl || paymentData.data?.paymentUrl || paymentData.paymentUrl;
      
      if (redirectUrl) {
        // Clear cart before redirecting to payment
        clearCart();
        window.location.href = redirectUrl;
        return;
      }

      // If no redirect URL, go to order confirmation
      clearCart();
      (router.push as (url: string) => void)(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} required />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </h2>
        
        {isLoadingAddresses ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#001F5F]" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedAddressId === addr.id ? "border-[#001F5F] bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 w-4 h-4 accent-[#001F5F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{addr.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {[addr.address_line1, addr.address_line2, addr.landmark].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                    {selectedAddressId === addr.id && (
                      <Check className="h-5 w-5 text-[#001F5F]" />
                    )}
                  </label>
                ))}
                
                {/* Add New Address Button */}
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#001F5F] hover:text-[#001F5F] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Address</span>
                </button>
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <div className="space-y-4">
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewAddressForm(false);
                      if (savedAddresses.length > 0) {
                        const defaultAddr = savedAddresses.find(a => a.is_default);
                        setSelectedAddressId(defaultAddr?.id || savedAddresses[0].id);
                      }
                    }}
                    className="text-sm text-[#001F5F] hover:underline"
                  >
                    ← Back to saved addresses
                  </button>
                )}
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main Street, Apartment 4B"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={showNewAddressForm || savedAddresses.length === 0}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" type="text" placeholder="Mumbai" value={formData.city} onChange={handleInputChange} required={showNewAddressForm || savedAddresses.length === 0} />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" type="text" placeholder="Maharashtra" value={formData.state} onChange={handleInputChange} required={showNewAddressForm || savedAddresses.length === 0} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">PIN Code *</Label>
                    <Input id="zipCode" type="text" placeholder="400001" value={formData.zipCode} onChange={handleInputChange} required={showNewAddressForm || savedAddresses.length === 0} />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" type="text" placeholder="India" value={formData.country} onChange={handleInputChange} required={showNewAddressForm || savedAddresses.length === 0} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h2>

        {/* Payment Option - Online Only */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-4 border-2 border-[#001F5F] bg-blue-50 rounded-lg">
            <Wallet className="h-5 w-5 text-[#001F5F]" />
            <div className="flex-1">
              <span className="font-medium">Pay Online (PhonePe)</span>
              <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
            </div>
            <Check className="h-5 w-5 text-[#001F5F]" />
          </div>
        </div>

        {/* Online Payment Info */}
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="text-sm">
            You will be redirected to PhonePe secure payment gateway to complete your payment.
          </p>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        type="submit"
        disabled={isProcessing || isLoadingAddresses}
        className="w-full bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-semibold text-lg py-6 disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </span>
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </form>
  );
}
