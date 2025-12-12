import { Suspense } from "react";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import OrderConfirmationContent from "./OrderConfirmationContent";
import { Loader2 } from "lucide-react";

function OrderConfirmationLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1">
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-[#001F5F] mb-4" />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />
      <Suspense fallback={<OrderConfirmationLoading />}>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
