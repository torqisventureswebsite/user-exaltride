import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import OrderConfirmationContent from "./OrderConfirmationContent";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TopBar />
      <OrderConfirmationContent />
      <Footer />
    </div>
  );
}
