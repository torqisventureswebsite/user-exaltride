import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <TopBar />

      <div className="bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          {/* ✅ PAGE TITLE */}
          <h1 className="text-3xl font-bold text-[#001F5F] mb-6">
            Return Policy
          </h1>

          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Returns is a scheme provided by respective sellers directly under
            this policy in terms of which the option of exchange, replacement
            and/or refund is offered by the respective sellers to you.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mb-8">
            The return policy is divided into three parts. Do read all sections
            carefully to understand the conditions and cases under which returns
            will be accepted.
          </p>

          {/* ✅ PART 1 */}
          <h2 className="text-lg font-semibold text-[#001F5F] mb-3 border-b pb-2">
            Part 1 - Category, Return Window and Actions Possible
          </h2>

          <div className="overflow-x-auto mb-10">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="border px-4 py-3 text-left font-semibold">
                    Returns Window, Actions Possible and Conditions (if any)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border px-4 py-3 align-top">
                    Auto related Products - Car accessories (accessories,
                    infotainment and decor)
                  </td>
                  <td className="border px-4 py-3">
                    2 days Replacement only <br />
                    Free replacement within 7 days if product is delivered in
                    defective/damaged condition. <br />
                    Product must be intact with original accessories, user
                    manual and warranty cards in original packaging.
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-3 align-top">
                    No Returns categories
                  </td>
                  <td className="border px-4 py-3">
                    Some products in the above categories are not returnable due
                    to their nature. Product page policy shall prevail.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ✅ PART 2 */}
          <h2 className="text-lg font-semibold text-[#001F5F] mb-3 border-b pb-2">
            Part 2 - Returns Pick-Up and Processing
          </h2>

          <p className="text-sm text-gray-700 mb-4">
            During pick-up, your product will be checked for the following
            conditions:
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="border px-4 py-3 text-left font-semibold">
                    Conditions
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border px-4 py-3">Correct Product</td>
                  <td className="border px-4 py-3">
                    Name, image, brand, serial number, article number, bar
                    code should match and MRP tag should be attached and clearly
                    visible.
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-3">Complete Product</td>
                  <td className="border px-4 py-3">
                    All in-the-box accessories like remote control, starter
                    kits, instruction manuals, chargers, headphones, freebies
                    and combos (if any) should be present.
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-3">Unused Product</td>
                  <td className="border px-4 py-3">
                    Product should be unused, unwashed, unsoiled, without stains
                    and with non-tampered quality check seals.
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-3">Undamaged Product</td>
                  <td className="border px-4 py-3">
                    Product should be undamaged without scratches, dents, tears
                    or holes.
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-3">Undamaged Packaging</td>
                  <td className="border px-4 py-3">
                    Product’s original packaging/box should be undamaged.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-700 mb-6">
            The field executive will refuse to accept the return if any of the
            above conditions are not met. Refund will be processed only after
            the returned product is verified by the seller.
          </p>

          {/* ✅ PART 3 */}
          <h2 className="text-lg font-semibold text-[#001F5F] mb-3 border-b pb-2">
            Part 3 - General Rules for a Successful Return
          </h2>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 mb-8">
            <li>
              If seller is unable to process replacement, refund will be given.
            </li>
            <li>
              Missing or damaged accessories may lead to partial refund.
            </li>
            <li>
              No return on cash-on-delivery orders once open-box delivery is
              accepted.
            </li>
            <li>
              For installation-based products, do not open packaging yourself.
            </li>
          </ul>

          {/* ✅ PART 4 */}
          <h2 className="text-lg font-semibold text-[#001F5F] mb-3 border-b pb-2">
            Part 4 - Details
          </h2>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>Return window: 2 days after delivery.</li>
            <li>
              Refund credited within 4–7 working days after verification.
            </li>
            <li>
              Replacement delivered within 20 working days.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
}
