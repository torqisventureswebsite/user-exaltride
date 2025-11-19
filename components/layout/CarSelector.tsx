"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CarSelector() {
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("Add Your Car");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(() => setCars([]));
  }, []);

  const handleSelect = (car: any) => {
    setSelectedCar(`${car.make} ${car.model} (${car.year})`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between gap-2
          border border-[#0033A1] text-[#0033A1]
          rounded-md px-4 h-[36px]   /* Matches Figma */
          bg-white font-medium cursor-pointer
          hover:bg-blue-50 transition
        "
      >
        <span className="whitespace-nowrap">{selectedCar}</span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
          <ul className="p-1">
            {cars.map((car) => (
              <li
                key={car.id}
                onClick={() => handleSelect(car)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {car.make} {car.model} {car.variant} ({car.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
