"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { CheckCircle, Home, Package, Download, X, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import WishlistSection from "@/components/cart/WishlistSection";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { tokens } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !tokens?.idToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${tokens.idToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order details");
        }

        setOrder(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, tokens]);

  // Calculate estimated delivery date (5-7 days from now)
  const getEstimatedDelivery = () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString("en-IN", options)} - ${end.toLocaleDateString("en-IN", options)}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-[#001F5F] mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "We couldn't find the order details."}</p>
          <Link href="/">
            <Button className="bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-semibold">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      {/* Success Banner */}
      <div className="bg-[#001F5F] rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-[#FBC84C] rounded-full p-3 flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-[#001F5F]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-blue-100">
              Thank you for your order. We'll send you shipping confirmation once your order is on the way.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details - Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-500 text-sm">Order placed on {orderDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-bold text-[#001F5F]">{order.orderNumber || order.orderId.slice(0, 10).toUpperCase()}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{item.subtotal?.toLocaleString() || (item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                  {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                </span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{order.taxAmount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Paid</span>
                <span className="text-[#001F5F]">₹{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cancel Order Section */}
          <div className="bg-yellow-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <X className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Need to Cancel Your Order?</p>
                <p className="text-sm text-gray-600">You can cancel this order within 24 hours of placement for a full refund.</p>
              </div>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-semibold py-6">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Estimated Delivery */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-[#001F5F]" />
              <span className="text-sm text-gray-500 uppercase">Estimated Delivery</span>
            </div>
            <p className="font-bold text-lg text-gray-900">{getEstimatedDelivery()}</p>
            <p className="text-sm text-gray-500 mt-1">We'll notify you when your order ships. Track your package anytime.</p>
          </div>

          <Link href={`/account/orders/${order.orderId}` as Route} className="block">
            <Button variant="outline" className="w-full border-[#001F5F] text-[#001F5F] font-semibold py-6">
              <Package className="h-5 w-5 mr-2" />
              Track Order
            </Button>
          </Link>

          <Button variant="outline" className="w-full py-6">
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="mt-12">
        <WishlistSection />
      </div>
    </div>
  );
}
