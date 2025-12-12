"use client";

import { MapPin, RotateCcw, Truck } from "lucide-react";
import { useLocation } from "@/lib/location/context";

interface DeliveryAndServicesProps {
  returnPolicy?: string | null;
  shippingInfo?: string | null;
}

export default function DeliveryAndServices({ returnPolicy, shippingInfo }: DeliveryAndServicesProps) {
  const { location, openModal } = useLocation();

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
      {/* TITLE */}
      <h3 className="text-lg font-semibold text-[#001F5F] font-medium">
        Delivery & Services
      </h3>

      {/* PINCODE CHECK */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {location?.pincode 
              ? `Deliver to ${location.city} - ${location.pincode}`
              : "Enter pincode for delivery info"
            }
          </span>
        </div>

        <button 
          onClick={openModal}
          className="bg-[#001F5F] text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800"
        >
          {location?.pincode ? "Change" : "Check"}
        </button>
      </div>

      {/* Shipping Info */}
      {shippingInfo && (
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Truck className="h-4 w-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <span>{shippingInfo}</span>
        </div>
      )}

      {/* Return Policy */}
      {returnPolicy && (
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <RotateCcw className="h-4 w-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <span>{returnPolicy}</span>
        </div>
      )}
    </div>
  );
}
