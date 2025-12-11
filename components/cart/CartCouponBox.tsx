"use client";

import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { toast } from "sonner";

// Available coupons (in a real app, this would come from an API)
const AVAILABLE_COUPONS = [
  { code: "EXALTI10", discount: 10, type: "percentage" as const },
  { code: "SAVE15", discount: 15, type: "percentage" as const },
];

interface ApplyCouponProps {
  onApplyCoupon?: (coupon: { code: string; discount: number; type: "percentage" | "fixed" }) => void;
  onRemoveCoupon?: () => void;
  appliedCoupon?: { code: string; discount: number; type: "percentage" | "fixed" } | null;
}

export default function ApplyCoupon({ onApplyCoupon, onRemoveCoupon, appliedCoupon }: ApplyCouponProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplying(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (coupon) {
      if (onApplyCoupon) {
        onApplyCoupon(coupon);
      }
      toast.success(`Coupon "${coupon.code}" applied!`, {
        description: `You get ${coupon.discount}% off on your order.`,
      });
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code", {
        description: "Please check the code and try again.",
      });
    }

    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
    toast.info("Coupon removed");
  };

  const handleQuickApply = (code: string) => {
    setCouponCode(code);
    // Auto-apply after setting
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (coupon && onApplyCoupon) {
      onApplyCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied!`, {
        description: `You get ${coupon.discount}% off on your order.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Apply Coupon</h2>
      </div>

      {/* Applied Coupon Display */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">{appliedCoupon.code}</span>
            <span className="text-sm text-green-600">
              ({appliedCoupon.discount}% off)
            </span>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Input + Button */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="bg-[#6E7FA0] hover:bg-[#617092] text-white font-semibold px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </div>

          {/* Separator */}
          <hr className="my-3" />

          {/* Available Coupons */}
          <p className="text-sm text-gray-600 mb-2">Available Coupons:</p>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COUPONS.map((coupon) => (
              <button
                key={coupon.code}
                onClick={() => handleQuickApply(coupon.code)}
                className="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {coupon.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
