"use client";

import { useState } from "react";
import { Pencil, Eye, EyeOff, LogOut, Car } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";

export function LoginSecurity() {
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change API
    alert("Password change functionality will be implemented with the backend API");
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
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900">{user?.name || "Not set"}</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Pencil size={14} />
              Edit
            </button>
          </div>

          {/* Email Address */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-gray-900">{user?.email || "Not set"}</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Pencil size={14} />
              Edit
            </button>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-900">{user?.phoneNumber || "Not set"}</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Pencil size={14} />
              Edit
            </button>
          </div>

          {/* Car Models */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-gray-500">Car Models</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#001F5F] text-white text-sm rounded-full">
                  <Car size={14} />
                  Honda City
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#001F5F] text-white text-sm rounded-full">
                  <Car size={14} />
                  Toyota Fortuner
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">We'll use this to personalize your product recommendations</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Pencil size={14} />
              Edit
            </button>
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

      {/* Change Password */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg transition-colors"
          >
            Update Password
          </button>
        </form>
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
