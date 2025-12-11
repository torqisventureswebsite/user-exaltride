import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Return Policy | ExaltRide",
  description: "Return Policy for ExaltRide - Your car accessories destination",
};

export default function ReturnPolicyPage() {
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
              <RotateCcw className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#001F5F]">
                Return Policy
              </h1>
              <p className="text-gray-500 text-sm">Easy returns & replacements</p>
            </div>
          </div>

          <div className="prose prose-sm md:prose max-w-none text-gray-700">
            <p className="mb-6">
              Returns is a scheme provided by respective sellers directly under this policy in terms of which the option of exchange, replacement and/or refund is offered by the respective sellers to you. All products listed under a particular category may not have the same returns policy. For all products, the returns/replacement policy provided on the product page shall prevail over the general returns policy.
            </p>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Part 1 – Category, Return Window and Actions Possible</h2>
            
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-[#001F5F] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Returns Window & Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      Auto Related Products<br />
                      <span className="text-gray-500 text-xs">(Car accessories, infotainment and decor)</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <strong>2 days Replacement only</strong><br />
                      Free replacement will be provided within 7 days if the product is delivered in defective/damaged condition or different from the ordered item subject to approval from Torqis.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 text-sm mb-0">
                  Please keep the product intact, with original accessories, user manual and warranty cards in the original packaging at the time of returning the product.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Part 2 - Returns Pick-Up and Processing</h2>
            <p className="mb-4">During pick-up, your product will be checked for the following conditions:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Correct Product</h4>
                  <p className="text-gray-600 text-xs">Name/image/brand/serial number should match and MRP tag should be undetached</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Complete Product</h4>
                  <p className="text-gray-600 text-xs">All in-the-box accessories, freebies and combos should be present</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Unused Product</h4>
                  <p className="text-gray-600 text-xs">Product should be unused, unwashed, unsoiled, without stains</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Undamaged Product</h4>
                  <p className="text-gray-600 text-xs">Product should be without scratches, dents, tears or holes</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm mb-0">
                  The field executive will refuse to accept the return if any of the above conditions are not met.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Part 3 - General Rules for a Successful Return</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>In certain cases where the seller is unable to process a replacement for any reason whatsoever, a refund will be given.</li>
              <li>In cases where a product accessory is found missing/damaged/defective, the seller may either process a replacement of the particular accessory or issue an eGV for an amount equivalent to the price of the accessory.</li>
              <li>During open box deliveries, if you received a different or damaged product, you will be given a refund (on the spot refunds for cash-on-delivery orders).</li>
              <li>For products where installation is provided by Torqis's service partners, do not open the product packaging by yourself.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#001F5F] mt-8 mb-4">Part 4 - Details</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-[#001F5F] text-white text-xs font-bold px-2 py-1 rounded">1</span>
                  <span>Return time frame for eligible products: <strong>2 days after delivery</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#001F5F] text-white text-xs font-bold px-2 py-1 rounded">2</span>
                  <span>Refund will be credited within <strong>4-7 working days</strong> after receiving the product</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#001F5F] text-white text-xs font-bold px-2 py-1 rounded">3</span>
                  <span>Exchange/replacement product delivered within <strong>20 working days</strong> after verification</span>
                </li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Torqis holds the right to restrict the number of returns created per order unit, post the evaluation of the product/order defect is undertaken by Torqis's authorized representative.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
