"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { AccountSidebar, AccountSection } from "@/components/account/AccountSidebar";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: string;
  vendorName: string;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const { tokens, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSectionChange = (section: AccountSection) => {
    if (section === "orders") return;
    router.push(`/account?section=${section}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!tokens?.idToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${tokens.idToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Filter to only show successful orders (exclude cancelled and pending payment)
          const allOrders = data.data || [];
          const successfulOrders = allOrders.filter((order: Order) => {
            const orderStatus = order.orderStatus?.toLowerCase();
            const paymentStatus = order.paymentStatus?.toLowerCase();
            
            // Exclude cancelled orders
            if (orderStatus === "cancelled") return false;
            
            // Exclude orders with failed or pending payment
            if (paymentStatus === "failed" || paymentStatus === "pending") return false;
            
            return true;
          });
          setOrders(successfulOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [tokens]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar activeSection="orders" onSectionChange={handleSectionChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="h-6 w-6" />
                My Orders
              </h1>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#001F5F]" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                  <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                  <Link href="/">
                    <Button className="bg-[#FBC84C] hover:bg-yellow-500 text-[#001F5F] font-semibold">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}` as any}
                      className="block"
                    >
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-[#001F5F] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                              {order.orderStatus}
                            </span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {order.vendorName && `Sold by: ${order.vendorName}`}
                          </span>
                          <span className="font-bold text-[#001F5F]">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
