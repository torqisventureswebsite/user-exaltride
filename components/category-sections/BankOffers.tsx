// components/category-sections/BankOffers.tsx
export default function BankOffers() {
  const offers = [
    {
      bank: "HDFC Bank Offer",
      desc: "10% Instant Discount on HDFC Cards | Min Spend ₹5,000",
    },
    {
      bank: "ICICI Bank Offer",
      desc: "5% Cashback on ICICI Credit Cards | Min Spend ₹3,000",
    },
    {
      bank: "SBI Bank Offer",
      desc: "No Cost EMI for 3 months | Min Spend ₹2,500",
    },
    {
      bank: "Axis Bank Offer",
      desc: "₹500 OFF on Axis Cards | Min Spend ₹4,000",
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-gray-900 mb-3">Bank Offers & Discounts</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {offers.map((o, i) => (
          <div
            key={i}
            className="p-4 border rounded-xl bg-white shadow-sm hover:shadow transition"
          >
            <h3 className="font-medium text-gray-900">{o.bank}</h3>
            <p className="text-sm text-gray-600 mt-1">{o.desc}</p>

            <p className="text-blue-600 text-xs font-semibold mt-2 cursor-pointer">
              T&C →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
