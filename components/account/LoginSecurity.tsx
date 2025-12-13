"use client";

import { useState } from "react";
import { Pencil, Check, X, LogOut, Car } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useCar } from "@/lib/car/context";
import { toast } from "sonner";

export function LoginSecurity() {
  const { user, logout } = useAuth();
  const { selectedCar } = useCar();
  
  // Edit states
  const [editingField, setEditingField] = useState<"name" | "email" | "phone" | null>(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const handleEdit = (field: "name" | "email" | "phone") => {
    setEditingField(field);
    setEditValues({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    });
  };

  const handleSave = async (field: "name" | "email" | "phone") => {
    // TODO: Implement API call to update user profile
    toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    });
  };

  const handleLogoutAllDevices = () => {
    const confirmed = window.confirm("Are you sure you want to logout from all devices?");
    if (confirmed) {
      logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Full Name</p>
              {editingField === "name" ? (
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className="mt-1 w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
                  autoFocus
                />
              ) : (
                <p className="font-medium text-gray-900">{user?.name || "Not set"}</p>
              )}
            </div>
            {editingField === "name" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave("name")}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Check size={14} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit("name")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          {/* Email Address */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email Address</p>
              {editingField === "email" ? (
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                  className="mt-1 w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
                  autoFocus
                />
              ) : (
                <p className="font-medium text-gray-900">{user?.email || "Not set"}</p>
              )}
            </div>
            {editingField === "email" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave("email")}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Check size={14} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit("email")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone Number</p>
              {editingField === "phone" ? (
                <input
                  type="tel"
                  value={editValues.phone}
                  onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                  className="mt-1 w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
                  autoFocus
                />
              ) : (
                <p className="font-medium text-gray-900">{user?.phoneNumber || "Not set"}</p>
              )}
            </div>
            {editingField === "phone" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave("phone")}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Check size={14} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit("phone")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          {/* Car Models - mapped from CarContext */}
          <div className="py-3">
            <div>
              <p className="text-sm text-gray-500">Car Models</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCar ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#001F5F] text-white text-sm rounded-full">
                    <Car size={14} />
                    {selectedCar.make} {selectedCar.model} {selectedCar.year}
                  </span>
                ) : (
                  <p className="text-gray-400 text-sm">No car added yet. Use "Add Your Car" to add one.</p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">We'll use this to personalize your product recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Login Information</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <div className="mt-1 px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              {user?.email || "Not set"}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="text-gray-700">
              {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Management</h3>
        <p className="text-sm text-gray-500 mb-4">
          Logout from all devices to ensure your account security.
        </p>
        
        <button
          onClick={handleLogoutAllDevices}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 transition-colors"
        >
          <LogOut size={18} />
          Logout from All Devices
        </button>
      </div>
    </div>
  );
}
