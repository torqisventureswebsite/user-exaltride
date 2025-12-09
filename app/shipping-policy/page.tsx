import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TopBar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-[#001F5F] mb-6">
          Shipping Policy
        </h1>

        <div className="border-t border-b py-6 text-gray-700 space-y-4 text-sm leading-7">
          <p>• Orders are shipped through registered domestic courier companies and/or speed post only.</p>

          <p>
            • Orders are delivered within 10 days from the date of order and/or
            payment or as per the delivery date agreed at the time of order
            confirmation, subject to courier company / post office norms.
          </p>

          <p>
            • Platform Owner shall not be liable for any delay in delivery by
            the courier company / postal authority.
          </p>

          <p>
            • Delivery of all orders will be made to the address provided by
            the buyer at the time of purchase.
          </p>

          <p>
            • Delivery confirmation will be sent to your email ID as specified
            at the time of registration.
          </p>

          <p>
            • Shipping cost(s) levied by the seller or Platform Owner are
            non-refundable.
          </p>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          For shipping-related inquiries, contact us at{" "}
          <span className="font-semibold text-blue-700">
            support@exaltride.com
          </span>{" "}
          or call{" "}
          <span className="font-semibold text-blue-700">
            1800-123-4567
          </span>
        </p>
      </div>

      <Footer />
    </div>
  );
}
