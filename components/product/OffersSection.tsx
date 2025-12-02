"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import offers from "@/data/offers.json";
import { Gift, Banknote, ShoppingBag, Copy } from "lucide-react";

const ICON_MAP: any = {
  bank: <Banknote className="text-blue-600" size={22} />,
  gift: <Gift className="text-emerald-600" size={22} />,
  combo: <ShoppingBag className="text-orange-600" size={22} />
};

export default function OffersSection() {
  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Available Offers
        </h2>

        <Button
          variant="outline"
          className="h-9 px-4 text-sm rounded-lg"
        >
          View All Offers →
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="p-5 rounded-2xl border border-gray-200 shadow-sm"
          >
            {/* Header Row */}
            <div className="flex items-start gap-3">
              {ICON_MAP[offer.icon]}
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {offer.type}
                </p>
                <p className="text-base font-bold text-blue-700">
                  {offer.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">{offer.desc}</p>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="mt-4 flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-2">
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 font-medium border-gray-300"
              >
                {offer.code}
              </Badge>

              <Copy size={16} className="text-gray-600 cursor-pointer" />
            </div>
            
            {/* Terms */}
            <p className="mt-3 text-[11px] text-gray-500">{offer.terms}</p>   

            {/* Apply Button */}
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded-lg text-sm h-10 flex items-center justify-center gap-1">
              Apply Offer →
            </Button>


          </Card>
        ))}
      </div>
    </section>
  );
}
