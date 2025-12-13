import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { Truck, Clock, MapPin, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | ExaltRide",
  description: "Shipping Policy for ExaltRide - Your car accessories destination",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#001F5F] p-3 rounded-xl">
              <Truck className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#001F5F]">
                Shipping Policy
              </h1>
              <p className="text-gray-500 text-sm">Fast & reliable delivery across India</p>
            </div>
          </div>

         <p className="prose prose-sm md:prose max-w-none text-gray-700">
              The orders for the user are shipped through registered domestic courier companies and/or
speed post only. Orders are delivered within 10 days from the date of the order and/or
payment or as per the delivery date agreed at the time of order confirmation and delivering
of the shipment, subject to courier company / post office norms. Platform Owner shall not be
liable for any delay in delivery by the courier company / postal authority. Delivery of all orders
will be made to the address provided by the buyer at the time of purchase. Delivery of our
services will be confirmed on your email ID as specified at the time of registration. If there
are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the
same is not refundable.
            </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
