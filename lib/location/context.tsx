"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface LocationData {
  city: string;
  pincode: string;
  state?: string;
  country?: string;
}

interface LocationContextType {
  location: LocationData | null;
  setLocation: (data: LocationData) => void;
  clearLocation: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = "user_location";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load saved location on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
      } catch {
        // Invalid saved data
      }
    }
  }, []);

  // Save location to localStorage and state
  const setLocation = useCallback((data: LocationData) => {
    setLocationState(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    // Dispatch event for any components that need to react
    window.dispatchEvent(new CustomEvent("locationChanged", { detail: data }));
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocationState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        clearLocation,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
