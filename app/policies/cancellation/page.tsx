import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { XCircle, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Cancellation Policy | ExaltRide",
  description: "Cancellation Policy for ExaltRide - Your car accessories destination",
};

export default function CancellationPolicyPage() {
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
              <XCircle className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#001F5F]">
                Cancellation Policy
              </h1>
              <p className="text-gray-500 text-sm">Flexible cancellation options</p>
            </div>
          </div>

          <div className="prose prose-sm md:prose max-w-none text-gray-700">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Before Dispatch</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    The customer can choose to cancel an order any time before it's dispatched.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">After Dispatch</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    The order cannot be canceled once it's out for delivery. However, the customer may choose to reject it at the doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Time Window</h3>
                  <p className="text-gray-600 text-sm mb-0">
                    The time window for cancellation varies based on different categories and the order cannot be canceled once the specified time has passed.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Important Points</h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="bg-[#001F5F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>In some cases, the customer may not be allowed to cancel the order for free, post the specified time and a <strong>cancellation fee will be charged</strong>. The details about the time window mentioned on the product page or order confirmation page will be considered final.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-[#001F5F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>In case of any cancellation from the seller due to unforeseen circumstances, a <strong>full refund will be initiated</strong> for prepaid orders.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-[#001F5F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Torqis reserves the right to accept the cancellation of any order. Torqis also reserves the right to waive off or modify the time window or cancellation fee from time to time.</span>
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Still have questions about our cancellation policy?</h3>
                  <p className="text-gray-600 mb-4">
                    Our customer support team is here to help you with any queries.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#001F5F] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
