import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TopBar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-[#001F5F] mb-6">
          Cancellation Policy
        </h1>

        <div className="border-t border-b py-6 text-gray-700 space-y-4 text-sm leading-7">
          <p>
            • The customer can choose to cancel an order any time before
            it's dispatched.
          </p>

          <p>
            • The order cannot be canceled once it's out for delivery.
            However, the customer may choose to reject it at the doorstep.
          </p>

          <p>
            • The time window for cancellation varies based on different
            categories and the order cannot be canceled once the specified time
            has passed.
          </p>

          <p>
            • In some cases, the customer may not be allowed to cancel the order
            for free, post the specified time and a cancellation fee will be
            charged. The details about the time window mentioned on the product
            page or order confirmation page will be considered final.
          </p>

          <p>
            • In case of any cancellation from the seller due to unforeseen
            circumstances, a full refund will be initiated for prepaid orders.
          </p>

          <p>
            • Torqis reserves the right to accept the cancellation of any
            order. Torqis also reserves the right to waive off or modify the time
            window or cancellation fee from time to time.
          </p>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            Still have questions about our cancellation policy?
          </p>

          <Link
            href="/contact"
            className="inline-block bg-[#001F5F] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
