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
              <p className="text-gray-500 text-sm">Return & Cancellation Policy</p>
            </div>
          </div>

          <div className="prose prose-sm md:prose max-w-none text-gray-700">
            <p className="mb-6">
              The customer can choose to cancel an order any time before it's dispatched. The order cannot
              be canceled once it’s out for delivery. However, the customer may choose to reject it at the
              doorstep.
              The time window for cancellation varies based on different categories and the order cannot be
              canceled once the specified time has passed.
              In some cases, the customer may not be allowed to cancel the order for free, post the specified
              time and a cancellation fee will be charged. The details about the time window mentioned on the
              product page or order confirmation page will be considered final.
              In case of any cancellation from the seller due to unforeseen circumstances, a full refund will be
              initiated for prepaid orders.
              Torqis reserves the right to accept the cancellation of any order. Torqis also reserves the right to
              waive off or modify the time window or cancellation fee from time to time.
              Returns Policy
              Returns is a scheme provided by respective sellers directly under this policy in terms of which the
              option of exchange, replacement and/ or refund is offered by the respective sellers to you. All
              products listed under a particular category may not have the same returns policy. For all
              products, the returns/replacement policy provided on the product page shall prevail over the
              general returns policy. Do refer the respective item's applicable return/replacement policy on the
              product page for any exceptions to this returns policy and the table below
              The return policy is divided into three parts; Do read all sections carefully to understand the
              conditions and cases under which returns will be accepted.
              Part 1 – Category, Return Window and Actions possible
              Category
              Returns Window, Actions Possible and
              Conditions (if any)
              Auto related Products - Car accessories
              (accessories, infotainment and decor)
              2 days Replacement only
              Free replacement will be provided within 7
              days if the product is delivered in
              defective/damaged condition or different from
              the ordered item subject to approval from
              torqis.
              Please keep the product intact, with original
              accessories, user manual and warranty cards
              in the original packaging at the time of
              returning the product.
              No Returns categories
              Some products in the above categories are
              not returnable due to their nature or other
              reasons. For all products, the policy on the
              product page shall prevail.
              Part 2 - Returns Pick-Up and Processing During pick-up, your product will be checked for the
              following conditions:
              Category Conditions
              Correct
              Product
              Name/ image/ brand/ serial number/ article number/ bar code should match
              and MRP tag should be undetached and clearly visible.
              Complete
              Product
              All in-the-box accessories (like remote control, starter kits, instruction
              manuals, chargers, headphones, etc.), freebies and combos (if any) should
              be present.
              Unused
              Product
              The product should be unused, unwashed, unsoiled, without any stains and
              with non-tampered quality check seals/return tags/warranty seals (wherever
              applicable).
              Undamaged
              Product
              The product (Charging port/ port, back-panel etc.) should be undamaged
              and without any scratches, dents, tears or holes.
              Undamaged
              Packaging
              The product’s original packaging/ box should be undamaged.
              The field executive will refuse to accept the return if any of the above conditions are not met.
              For any products for which a refund is to be given, the refund will be processed once the
              returned product has been received by the seller.
              Part 3 - General Rules for a successful Return
              ●
              ●
              ●
              ●
              In certain cases where the seller is unable to process a replacement for any reason
              whatsoever, a refund will be given.
              In cases where a product accessory is found missing/damaged/defective, the seller may
              either process a replacement of the particular accessory or issue an eGV for an amount
              equivalent to the price of the accessory, at the seller’s discretion.
              During open box deliveries, while accepting your order, if you received a different or a
              damaged product, you will be given a refund (on the spot refunds for cash-on-delivery
              orders). Once you have accepted an open box delivery, no return request will be
              processed, except for manufacturing defects. In such cases, these category-specific
              replacement/return general conditions will be applicable.
              For products where installation is provided by Torqis's service partners, do not open the
              product packaging by yourself. Torqis authorised personnel shall help in unboxing and
              installation of the product.
              Part 4 - Details
              ●
              ●
              Return time frame for the eligible products will be 2 days after delivery
              The refund will be credited into the original source within 4-7 working days after receiving
              the product and if no fraudulent activity is found from user.
              ●
              The Exchange/replacement product will be delivered within 20 working days after
              successful verification of the returned product by seller.
              Torqis holds the right to restrict the number of returns created per order unit, post the evaluation
              of the product/order defect is undertaken by Torqis’s authorized representative.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
