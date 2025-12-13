"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Car, X, Check, Loader2 } from "lucide-react";
import { useCar } from "@/lib/car/context";

export default function CarSelector() {
  const {
    selectedCar,
    setSelectedCar,
    clearSelectedCar,
    makes,
    getModelsForMake,
    getYearsForMakeModel,
    getVariantsForMakeModelYear,
    getCarId,
    isLoading,
  } = useCar();

  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [variant, setVariant] = useState("");

  // Derived dropdown options
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [variants, setVariants] = useState<string[]>([]);

  // Update models when make changes
  useEffect(() => {
    if (make) {
      setModels(getModelsForMake(make));
    } else {
      setModels([]);
    }
    // Reset dependent fields
    setModel("");
    setYear("");
    setVariant("");
  }, [make, getModelsForMake]);

  // Update years when model changes
  useEffect(() => {
    if (make && model) {
      setYears(getYearsForMakeModel(make, model));
    } else {
      setYears([]);
    }
    // Reset dependent fields
    setYear("");
    setVariant("");
  }, [make, model, getYearsForMakeModel]);

  // Update variants when year changes
  useEffect(() => {
    if (make && model && year) {
      setVariants(getVariantsForMakeModelYear(make, model, year as number));
    } else {
      setVariants([]);
    }
    // Reset variant
    setVariant("");
  }, [make, model, year, getVariantsForMakeModelYear]);

  const handleSave = useCallback(() => {
    if (!make || !model || !year) return;

    const carId = getCarId(make, model, year as number, variant);
    
    const carData = {
      id: carId || `${make}-${model}-${year}-${variant}`,
      make,
      model,
      year: year as number,
      variant,
    };

    setSelectedCar(carData);
    setIsOpen(false);
    
    // Reset form
    setMake("");
    setModel("");
    setYear("");
    setVariant("");
  }, [make, model, year, variant, getCarId, setSelectedCar]);

  const handleRemove = useCallback(() => {
    clearSelectedCar();
  }, [clearSelectedCar]);

  const displayText = selectedCar
    ? `${selectedCar.make} ${selectedCar.model}${selectedCar.year ? ` (${selectedCar.year})` : ""}`
    : "Add Your Car";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2 text-gray-700 px-0 py-2 bg-transparent font-medium cursor-pointer hover:text-gray-900 transition"
      >
        <Car className="h-4 w-4" />
        <span className="whitespace-nowrap text-sm">{displayText}</span>
        <ChevronDown size={14} />
      </button>

      {/* Modal */}
      {isOpen && (
        <>

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

            {/* Loading State */}
            {isLoading && (
              <div className="mb-5 p-4 bg-gray-50 rounded-lg flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Loading cars...</span>
              </div>
            )}

            {/* Current Car Display */}
            {selectedCar && (
              <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {selectedCar.make} {selectedCar.model} {selectedCar.variant}
                  </p>
                  {selectedCar.year && (
                    <p className="text-xs text-yellow-600">Year: {selectedCar.year}</p>
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
              {/* Brand/Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">Select Brand</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!make || isLoading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year of Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Year of Make <span className="text-red-500">*</span>
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                  disabled={!model || isLoading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Variant
                </label>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  disabled={!year || isLoading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="">Select Variant (Optional)</option>
                  {variants.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!make || !model || !year || isLoading}
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
