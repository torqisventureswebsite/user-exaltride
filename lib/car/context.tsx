"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "user_car";
const CARS_API_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod/v1/cars";

// Types for the API response
export interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  fuelType: string | null;
}

export interface SelectedCar {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
}

interface CarContextType {
  // Selected car state
  selectedCar: SelectedCar | null;
  setSelectedCar: (car: SelectedCar | null) => void;
  clearSelectedCar: () => void;
  
  // API data
  allCars: CarData[];
  isLoading: boolean;
  error: string | null;
  
  // Derived data for dropdowns
  makes: string[];
  getModelsForMake: (make: string) => string[];
  getYearsForMakeModel: (make: string, model: string) => number[];
  getVariantsForMakeModelYear: (make: string, model: string, year: number) => string[];
  getCarId: (make: string, model: string, year: number, variant: string) => string | null;
  
  // Refresh data
  refreshCars: () => Promise<void>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export function CarProvider({ children }: { children: ReactNode }) {
  const [selectedCar, setSelectedCarState] = useState<SelectedCar | null>(null);
  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars from API
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(CARS_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAllCars(data.data || []);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cars");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved car from localStorage and fetch cars on mount
  useEffect(() => {
    // Load saved car
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSelectedCarState(JSON.parse(saved));
      } catch {
        // Invalid saved data
      }
    }
    
    // Fetch cars from API
    fetchCars();
  }, [fetchCars]);

  // Set selected car and persist to localStorage
  const setSelectedCar = useCallback((car: SelectedCar | null) => {
    setSelectedCarState(car);
    if (car) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(car));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent("carChanged", { detail: car }));
  }, []);

  // Clear selected car
  const clearSelectedCar = useCallback(() => {
    setSelectedCarState(null);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("carChanged", { detail: null }));
  }, []);

  // Get unique makes
  const makes = React.useMemo(() => {
    const uniqueMakes = [...new Set(allCars.map(car => car.make))];
    return uniqueMakes.sort();
  }, [allCars]);

  // Get models for a specific make
  const getModelsForMake = useCallback((make: string): string[] => {
    const models = [...new Set(
      allCars
        .filter(car => car.make === make)
        .map(car => car.model)
    )];
    return models.sort();
  }, [allCars]);

  // Get years for a specific make and model
  const getYearsForMakeModel = useCallback((make: string, model: string): number[] => {
    const years = [...new Set(
      allCars
        .filter(car => car.make === make && car.model === model)
        .map(car => car.year)
    )];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }, [allCars]);

  // Get variants for a specific make, model, and year
  const getVariantsForMakeModelYear = useCallback((make: string, model: string, year: number): string[] => {
    const variants = [...new Set(
      allCars
        .filter(car => car.make === make && car.model === model && car.year === year)
        .map(car => car.variant)
    )];
    return variants.sort();
  }, [allCars]);

  // Get car ID for a specific combination
  const getCarId = useCallback((make: string, model: string, year: number, variant: string): string | null => {
    const car = allCars.find(
      c => c.make === make && c.model === model && c.year === year && c.variant === variant
    );
    return car?.id || null;
  }, [allCars]);

  const value: CarContextType = {
    selectedCar,
    setSelectedCar,
    clearSelectedCar,
    allCars,
    isLoading,
    error,
    makes,
    getModelsForMake,
    getYearsForMakeModel,
    getVariantsForMakeModelYear,
    getCarId,
    refreshCars: fetchCars,
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
}

export function useCar() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error("useCar must be used within a CarProvider");
  }
  return context;
}
