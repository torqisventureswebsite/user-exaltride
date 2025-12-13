"use client";

import { ShieldCheck, CheckCircle, Zap, MapPin } from "lucide-react";
import { useLocation } from "@/lib/location/context";

export default function ProfessionalInstallationCard() {
  const { location, openModal } = useLocation();

  return (
    <div className="bg-[#FFFDF7] border border-yellow-200 rounded-2xl p-4 space-y-4 shadow-sm">
      
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-blue-700" />
        <h3 className="font-semibold text-gray-900">
          Professional Installation Available
        </h3>
      </div>

      <p className="text-sm text-gray-600">
        Book expert installation service at your doorstep
      </p>

      {/* PRICE ROW */}
      <div className="flex items-center justify-between text-sm pt-2">
        <span className="text-gray-700">Installation Service</span>
        <span className="font-semibold text-gray-900">₹499</span>
      </div>

      {/* FEATURES */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          Certified technician at your location
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          Same-day installation available
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          30-day installation warranty
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          Free sound tuning & optimization
        </div>
      </div>

      {/* CTA BUTTON */}
      <button className="w-full mt-2 bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
        <Zap className="h-4 w-4" />
        Add Installation Service (₹499)
      </button>

      {/* LOCATION INFO */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>
            {location?.pincode 
              ? `Checking availability in ${location.pincode}`
              : "Enter pincode to check availability"
            }
          </span>
        </div>

        <button 
          onClick={openModal}
          className="text-blue-600 font-medium hover:underline"
        >
          {location?.pincode ? "Change" : "Enter Pincode"}
        </button>
      </div>

      {/* Service Not Available Message */}
      {location?.pincode && (
        <p className="text-xs text-red-600 mt-1">
          Sorry, installation service is not available at your location ({location.pincode}). We are expanding soon!
        </p>
      )}
    </div>
  );
}
