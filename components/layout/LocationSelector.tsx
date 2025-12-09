"use client";
import { useEffect, useState, useCallback } from "react";
import { MapPin, Navigation, X, Loader2 } from "lucide-react";

interface LocationData {
  city: string;
  pincode: string;
  state?: string;
  country?: string;
}

const STORAGE_KEY = "user_location";

export default function LocationSelector() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved location on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch {
        // Invalid saved data, will prompt user
      }
    }
  }, []);

  // Save location to localStorage
  const saveLocation = useCallback((data: LocationData) => {
    setLocation(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsOpen(false);
    setError("");
  }, []);

  // Fetch location from coordinates using reverse geocoding
  const fetchLocationFromCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch location");
      
      const data = await response.json();
      const address = data.address;
      
      const locationData: LocationData = {
        city: address.city || address.town || address.village || address.suburb || "Unknown",
        pincode: address.postcode || "",
        state: address.state || "",
        country: address.country || "",
      };
      
      saveLocation(locationData);
    } catch (err) {
      setError("Failed to detect location. Please enter pincode manually.");
    } finally {
      setIsLoading(false);
    }
  }, [saveLocation]);

  // Get current location using browser geolocation
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationFromCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enter pincode manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location unavailable. Please enter pincode manually.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("Failed to get location. Please enter pincode manually.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, [fetchLocationFromCoords]);

  // Fetch location from pincode
  const fetchLocationFromPincode = useCallback(async () => {
    if (!pincode || pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Using India Post API for Indian pincodes
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const locationData: LocationData = {
          city: postOffice.District || postOffice.Name,
          pincode: pincode,
          state: postOffice.State,
          country: "India",
        };
        saveLocation(locationData);
        setPincode("");
      } else {
        setError("Invalid pincode. Please check and try again.");
      }
    } catch (err) {
      setError("Failed to fetch location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [pincode, saveLocation]);

  const displayLocation = location 
    ? `${location.city}${location.pincode ? ` ${location.pincode}` : ""}`
    : "Select Location";

  return (
    <>
      {/* Location Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <div className="flex flex-col leading-tight text-left">
          <span className="text-xs text-gray-500">Deliver to</span>
          <span className="font-medium text-sm flex items-center gap-1">
            {displayLocation} <span className="text-[11px]">▼</span>
          </span>
        </div>
      </button>

      {/* Location Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-[90%] max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Choose your location</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select a delivery location to see product availability and delivery options
            </p>

            {/* Detect Location Button */}
            <button
              onClick={detectLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
              {isLoading ? "Detecting..." : "Detect my location"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Pincode Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Enter pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPincode(value);
                    setError("");
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
                <button
                  onClick={fetchLocationFromPincode}
                  disabled={isLoading || pincode.length !== 6}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            {/* Current Location Display */}
            {location && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Current location:</span>{" "}
                  {location.city}{location.state ? `, ${location.state}` : ""}{" "}
                  {location.pincode && `- ${location.pincode}`}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
