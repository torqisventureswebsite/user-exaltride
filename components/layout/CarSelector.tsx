"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Car, X, Check } from "lucide-react";

const STORAGE_KEY = "user_car";

// Generate years from current year to 1990
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year.toString());
  }
  return years;
};

const YEARS = generateYears();

export default function CarSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedCar, setSavedCar] = useState<{
    brand: string;
    car: string;
    model: string;
    year: string;
  } | null>(null);

  // Form state
  const [brand, setBrand] = useState("");
  const [car, setCar] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  // Load saved car on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedCar(JSON.parse(saved));
      } catch {
        // Invalid saved data
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!brand.trim() || !car.trim()) return;

    const carData = {
      brand: brand.trim(),
      car: car.trim(),
      model: model.trim(),
      year: year,
    };

    setSavedCar(carData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carData));
    setIsOpen(false);
    
    // Reset form
    setBrand("");
    setCar("");
    setModel("");
    setYear("");
  }, [brand, car, model, year]);

  const handleRemove = useCallback(() => {
    setSavedCar(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const displayText = savedCar
    ? `${savedCar.brand} ${savedCar.car}${savedCar.year ? ` (${savedCar.year})` : ""}`
    : "Add Your Car";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2 text-gray-700 px-3 py-2 bg-transparent font-medium cursor-pointer hover:text-gray-900 transition"
      >
        <Car className="h-4 w-4" />
        <span className="whitespace-nowrap text-sm">{displayText}</span>
        <ChevronDown size={14} />
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-[90%] max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Car className="h-5 w-5 text-[#001F5F]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add Your Car</h2>
                  <p className="text-xs text-gray-500">Get personalized recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Car Display */}
            {savedCar && (
              <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {savedCar.brand} {savedCar.car} {savedCar.model}
                  </p>
                  {savedCar.year && (
                    <p className="text-xs text-yellow-600">Year: {savedCar.year}</p>
                  )}
                </div>
                <button
                  onClick={handleRemove}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Toyota, Honda, Maruti"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Car */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Car <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={car}
                  onChange={(e) => setCar(e.target.value)}
                  placeholder="e.g., Innova, City, Swift"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Model/Variant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Model / Variant
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., VX, ZX, LXI"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Year of Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Year of Make
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Select Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!brand.trim() || !car.trim()}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-[#001F5F] hover:bg-[#001844] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <Check className="h-5 w-5" />
              Save Car
            </button>
          </div>
        </>
      )}
    </>
  );
}
