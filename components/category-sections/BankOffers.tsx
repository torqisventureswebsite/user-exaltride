import { CreditCard, ArrowRight } from "lucide-react";

export default function BankOffers() {
  const offers = [
    {
      bank: "HDFC Bank Offer",
      desc: "10% Instant Discount on HDFC Bank Credit Cards",
      min: "Min. Spend: ₹5,000",
    },
    {
      bank: "ICICI Bank Offer",
      desc: "5% Cashback on ICICI Credit Cards",
      min: "Min. Spend: ₹3,000",
    },
    {
      bank: "SBI Bank Offer",
      desc: "No Cost EMI on SBI Credit Cards for 3 months",
      min: "Min. Spend: ₹2,500",
    },
    {
      bank: "Axis Bank Offer",
      desc: "₹500 off on Axis Bank Debit Cards",
      min: "Min. Spend: ₹4,000",
    },
  ];

  return (
    <div className="mt-6">
      {/* Title Row with Icon */}
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-blue-700" />
        <h2 className="font-semibold text-gray-900 text-lg">
          Bank Offers & Discounts
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {offers.map((o, i) => (
          <div
            key={i}
            className="
              p-4 rounded-2xl border border-[#DCE8FF]
              bg-gradient-to-r from-[#F7FAFF] to-[#EDF4FF]
              flex items-center justify-between gap-4
              hover:shadow-md transition
            "
          >
            {/* Left Section */}
            <div className="flex items-start gap-3">
              {/* Icon Box */}
              <div className="p-3 rounded-xl bg-[#EEF3FF] border border-[#D0DCFF]">
                <CreditCard className="h-5 w-5 text-blue-700" />
              </div>

              {/* Text Block */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {o.bank}
                </h3>
                <p className="text-xs text-gray-600">{o.desc}</p>
                <p className="text-xs text-gray-600">{o.min}</p>
              </div>
            </div>

            {/* T&C Link */}
            <button className="flex items-center gap-1 text-blue-700 text-sm font-semibold hover:underline">
              T&C <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
