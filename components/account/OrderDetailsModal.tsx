"use client";

import { useState, useEffect } from "react";
import { X, Package, MapPin, ShoppingCart, Download, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { getOrderDetails, cancelOrder, formatOrderDate, formatCurrency, getStatusColor, formatOrderStatus } from "@/lib/orders";
import type { OrderDetails, OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order Placed" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  if (status === "confirmed") return 0;
  const index = ORDER_STEPS.findIndex((s) => s.status === status);
  return index >= 0 ? index : 0;
}

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const { tokens } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!tokens?.authToken) {
        setLoading(false);
        setError("Please login to view order details");
        return;
      }

      try {
        setLoading(true);
        const data = await getOrderDetails(orderId, tokens.authToken);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, tokens?.authToken]);

  const handleCancelOrder = async () => {
    if (!tokens?.authToken || !order) return;

    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      setCancelling(true);
      await cancelOrder(orderId, tokens.authToken);
      setOrder({ ...order, orderStatus: "cancelled" });
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;
  const canCancel = order && ["pending", "confirmed"].includes(order.orderStatus);
  const canRequestCancellation = order && ["packed", "shipped"].includes(order.orderStatus);
  const isDelivered = order?.orderStatus === "delivered";
  const isCancelled = order?.orderStatus === "cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001F5F]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order Number & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Placed on {formatOrderDate(order.createdAt)}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getStatusColor(order.orderStatus)
                )}>
                  {formatOrderStatus(order.orderStatus)}
                </span>
              </div>

              {/* Order Status Timeline */}
              {!isCancelled && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Order Status</h4>
                  <div className="flex items-center justify-between">
                    {ORDER_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <div key={step.status} className="flex flex-col items-center flex-1">
                          <div className="relative flex items-center w-full">
                            {index > 0 && (
                              <div className={cn(
                                "absolute left-0 right-1/2 h-0.5 -translate-y-1/2 top-3",
                                index <= currentStep ? "bg-green-500" : "bg-gray-300"
                              )} />
                            )}
                            {index < ORDER_STEPS.length - 1 && (
                              <div className={cn(
                                "absolute left-1/2 right-0 h-0.5 -translate-y-1/2 top-3",
                                index < currentStep ? "bg-green-500" : "bg-gray-300"
                              )} />
                            )}
                            <div className={cn(
                              "relative z-10 w-6 h-6 rounded-full flex items-center justify-center mx-auto",
                              isCompleted ? "bg-green-500" : "bg-gray-300"
                            )}>
                              {isCompleted ? (
                                <Check size={14} className="text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                          <span className={cn(
                            "text-xs mt-2 text-center",
                            isCurrent ? "font-medium text-gray-900" : "text-gray-500"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Track Package Button */}
                  {order.orderStatus === "shipped" && (
                    <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors">
                      Track Package
                    </button>
                  )}
                </div>
              )}

              {/* Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Items ({order.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Shipping Address
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h4>
                <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={order.shippingFee === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                      {order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}
                    </span>
                  </div>
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="text-gray-900 capitalize">{order.paymentMethod}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={cn(
                      "font-medium",
                      order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                    )}>
                      {order.paymentStatus === "paid" ? "Paid (Prepaid)" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {isDelivered && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg text-sm transition-colors">
                      <ShoppingCart size={16} />
                      Buy Again
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg text-sm transition-colors">
                      <Download size={16} />
                      Download Invoice
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg text-sm transition-colors">
                      <AlertCircle size={16} />
                      Report Problem
                    </button>
                  </>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    {cancelling ? "Cancelling..." : "Request Cancellation"}
                  </button>
                )}

                {canRequestCancellation && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    {cancelling ? "Requesting..." : "Request Cancellation"}
                  </button>
                )}

                {!isDelivered && !isCancelled && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg text-sm transition-colors">
                    <Download size={16} />
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
