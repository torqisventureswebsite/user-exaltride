"use client";

import { CheckCircle, Truck, RefreshCcw, Headphones } from "lucide-react";

export default function WhyBuyFromUs() {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Why Buy From Us</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-gray-800">Genuine Products</p>
            <p className="text-gray-600 text-xs">
              100% authentic & quality verified
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-800">Fast Delivery</p>
            <p className="text-gray-600 text-xs">
              Same day dispatch on most orders
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RefreshCcw className="h-5 w-5 text-purple-600" />
          <div>
            <p className="font-medium text-gray-800">Easy Returns</p>
            <p className="text-gray-600 text-xs">
              Hassle-free 7-day return policy
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Headphones className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-gray-800">Expert Support</p>
            <p className="text-gray-600 text-xs">
              24/7 customer care assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
