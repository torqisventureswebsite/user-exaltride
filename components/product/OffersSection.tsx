"use client";

import { Home, Truck, CreditCard } from "lucide-react";

export default function OffersSection() {
  const offers = [
    {
      icon: <Home className="h-5 w-5 text-blue-700" />,
      title: "Bank Offer",
      desc: "10% instant discount on SBI Credit Cards, up to ₹1,500"
    },
    {
      icon: <Truck className="h-5 w-5 text-blue-700" />,
      title: "Free Delivery",
      desc: "Free delivery on orders above ₹999"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-yellow-600" />,
      title: "No Cost EMI",
      desc: "No cost EMI available on orders above ₹3,000"
    }
  ];

  return (
    <div className="bg-[#F8FAFC] border rounded-2xl p-5 space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[#001F5F] font-medium">
        Available Offers
      </h3>

      <div className="space-y-4">
        {offers.map((offer, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1">{offer.icon}</div>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                {offer.title}
              </p>
              <p className="text-sm text-gray-600">{offer.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
