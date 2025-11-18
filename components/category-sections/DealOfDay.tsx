// components/category-sections/DealOfDay.tsx
import { Flame } from "lucide-react";

export default function DealOfDay() {
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flame className="text-red-500 h-6 w-6" />
        <div>
          <h3 className="font-semibold text-gray-900">
            Deal of the Day{" "}
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-lg">
              Up to 65% OFF
            </span>
          </h3>
          <p className="text-xs text-gray-600">12 special offers available today</p>
        </div>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
        View All Deals →
      </button>
    </div>
  );
}
