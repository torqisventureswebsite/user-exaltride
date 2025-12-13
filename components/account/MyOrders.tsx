"use client";

import { useState, useEffect } from "react";
import { Search, Package, Download, ShoppingCart, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { getAllOrders, formatOrderDate, formatCurrency, getStatusColor, formatOrderStatus } from "@/lib/orders";
import type { Order } from "@/lib/orders";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { cn } from "@/lib/utils";

type OrderTab = "all" | "buy-again" | "not-shipped";

export function MyOrders() {
  const { tokens } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!tokens?.idToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllOrders(tokens.idToken);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [tokens?.idToken]);

  const filteredOrders = orders.filter((order) => {
    // First, exclude cancelled orders and orders with failed/pending payment
    const orderStatus = order.orderStatus?.toLowerCase();
    const paymentStatus = (order as any).paymentStatus?.toLowerCase();
    
    // Exclude cancelled orders
    if (orderStatus === "cancelled") return false;
    
    // Exclude orders with failed or pending payment
    if (paymentStatus === "failed" || paymentStatus === "pending") return false;

    // Filter by tab
    if (activeTab === "not-shipped") {
      if (!["pending", "confirmed", "packed"].includes(order.orderStatus)) {
        return false;
      }
    } else if (activeTab === "buy-again") {
      if (order.orderStatus !== "delivered") {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const tabs = [
    { id: "all" as const, label: "Orders" },
    { id: "buy-again" as const, label: "Buy Again" },
    { id: "not-shipped" as const, label: "Not Yet Shipped" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001F5F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-[#001F5F]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#001F5F]" />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders by product name or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Orders Found</h3>
          <p className="text-sm text-gray-500">No orders in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewOrder={() => setSelectedOrderId(order.id)}
            />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onViewOrder: () => void;
}

function OrderCard({ order, onViewOrder }: OrderCardProps) {
  const showBuyAgain = order.orderStatus === "delivered";
  const showInvoice = ["shipped", "delivered"].includes(order.orderStatus);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Order ID: <span className="font-medium text-gray-900">{order.orderNumber}</span>
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            getStatusColor(order.orderStatus)
          )}>
            {formatOrderStatus(order.orderStatus)}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          Placed on {formatOrderDate(order.createdAt)}
        </span>
      </div>

      {/* Order Content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image Placeholder */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <Package className="h-8 w-8 text-gray-400" />
          </div>

          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 mb-1">
              {order.vendorName ? `From ${order.vendorName}` : "Order Items"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {order.items?.length || 1} item(s)
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onViewOrder}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg text-sm transition-colors"
          >
            <Eye size={16} />
            View Order
          </button>
          
          {showInvoice && (
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-gray-900 font-medium rounded-lg text-sm transition-colors">
              <Download size={16} />
              Invoice
            </button>
          )}
          
          {showBuyAgain && (
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg text-sm transition-colors">
              <ShoppingCart size={16} />
              Buy Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
