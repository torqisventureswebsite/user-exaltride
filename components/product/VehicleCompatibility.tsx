"use client";

import { CheckCircle, Car } from "lucide-react";

interface CompatibleCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  notes?: string;
}

interface VehicleCompatibilityProps {
  compatibleCars?: CompatibleCar[];
  isUniversal?: boolean;
}

export default function VehicleCompatibility({ compatibleCars, isUniversal }: VehicleCompatibilityProps) {
  // If universal fit, show that message
  if (isUniversal) {
    return (
      <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-lg font-semibold font-medium text-[#001F5F]">
          Vehicle Compatibility
        </h3>
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Universal Fit</p>
            <p className="text-xs text-gray-500">This product fits most vehicles</p>
          </div>
        </div>
      </div>
    );
  }

  // If no compatible cars data, show placeholder
  if (!compatibleCars || compatibleCars.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-lg font-semibold font-medium text-[#001F5F]">
          Vehicle Compatibility
        </h3>
        <div className="flex items-start gap-3 text-gray-500">
          <Car className="h-5 w-5 mt-0.5" />
          <p className="text-sm">Compatibility information not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold font-medium text-[#001F5F]">
        Vehicle Compatibility
      </h3>

      <div className="space-y-4">
        {compatibleCars.slice(0, 5).map((car) => (
          <div key={car.id} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {car.make} {car.model} ({car.year}{car.variant ? ` - ${car.variant}` : ""})
              </p>
              {car.notes && (
                <p className="text-xs text-gray-500">{car.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {compatibleCars.length > 5 && (
        <div className="pt-3 border-t">
          <button className="text-sm text-blue-700 font-medium hover:underline">
            View all {compatibleCars.length} compatible vehicles
          </button>
        </div>
      )}
    </div>
  );
}
