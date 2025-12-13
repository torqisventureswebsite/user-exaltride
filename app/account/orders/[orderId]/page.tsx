"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDetails {
  id: string;
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
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { tokens } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

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

        if (response.ok) {
          setOrder(data.data || data);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, tokens]);

  const handleCancelOrder = async () => {
    if (!order || !tokens?.idToken) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.idToken}`,
        },
      });

      if (response.ok) {
        toast.success("Order cancelled successfully");
        setOrder({ ...order, orderStatus: "cancelled" });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentStep = () => {
    const statusIndex = statusSteps.findIndex((s) => s.key === order?.orderStatus);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <TopBar />
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#001F5F]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <TopBar />
        <div className="container mx-auto px-4 py-16 flex-1 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find this order.</p>
          <Link href={"/account/orders" as any}>
            <Button className="bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F]">
              View All Orders
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Back Button */}
        <Link href={"/account/orders" as any} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  order.orderStatus === "delivered" ? "bg-green-100 text-green-800" :
                  order.orderStatus === "cancelled" ? "bg-red-100 text-red-800" :
                  order.orderStatus === "shipped" ? "bg-purple-100 text-purple-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Progress Tracker */}
              {order.orderStatus !== "cancelled" && (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-[#001F5F] text-white" : "bg-gray-200 text-gray-400"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center ${isCurrent ? "font-semibold text-[#001F5F]" : "text-gray-500"}`}>
                            {step.label}
                          </p>
                          {index < statusSteps.length - 1 && (
                            <div className={`hidden md:block absolute h-1 w-full top-5 left-1/2 ${
                              index < currentStep ? "bg-[#001F5F]" : "bg-gray-200"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(item.subtotal || item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={order.shippingFee === 0 ? "text-green-600" : ""}>
                    {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                  </span>
                </div>
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{order.taxAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#001F5F]">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>

            {order.orderStatus === "pending" && (
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
