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

          <div className="prose prose-sm md:prose max-w-none text-gray-700">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 font-medium mb-0">
                We strive to deliver your orders as quickly as possible with our trusted logistics partners.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-[#001F5F] p-2 rounded-lg flex-shrink-0">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipping Partners</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    Orders are shipped through registered domestic courier companies and/or speed post only.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-[#001F5F] p-2 rounded-lg flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivery Timeline</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    Orders are delivered within <strong>10 days</strong> from the date of order and/or payment or as per the delivery date agreed at the time of order confirmation, subject to courier company / post office norms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-[#001F5F] p-2 rounded-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    Delivery of all orders will be made to the address provided by the buyer at the time of purchase.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Important Information</h2>
            
            <ul className="list-disc pl-6 space-y-3 mb-6">
              <li>Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.</li>
              <li>Delivery confirmation will be sent to your email ID as specified at the time of registration.</li>
              <li>Shipping cost(s) levied by the seller or Platform Owner are non-refundable.</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-gray-900 mb-4">Shipping Inquiries</h3>
              <p className="text-gray-700 mb-4">
                For shipping-related inquiries, contact us at:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:support@exaltride.com" 
                  className="flex items-center gap-2 text-[#001F5F] hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  support@exaltride.com
                </a>
                <a 
                  href="tel:1800-123-4567" 
                  className="flex items-center gap-2 text-[#001F5F] hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  1800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
