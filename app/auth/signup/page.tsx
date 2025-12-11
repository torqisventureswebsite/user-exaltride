"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";
import type { UserRole } from "@/lib/auth/types";

export default function SignupPage() {
  const router = useRouter();
  const { signup, login, verifyOtp, loginWithGoogle } = useAuth();
  
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    phoneNumber: "+91",
    name: "",
    role: "buyer" as UserRole,
  });
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First, signup the user
      await signup(formData.phoneNumber, formData.name, formData.role);
      
      // Then, initiate login to send OTP
      const sessionId = await login(formData.phoneNumber);
      setSession(sessionId);
      setStep("otp");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("user already exists")) {
        setError("This phone number is already registered. Please login instead.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtp(formData.phoneNumber, session, otp);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +91 prefix is always present
    if (!value.startsWith("+91")) {
      setFormData({ ...formData, phoneNumber: "+91" });
    } else {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-500">
              Join thousands of happy customers today.
            </p>
          </div>

          {step === "details" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full h-11 border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Whatsapp Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  className="w-full h-11 border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#001F5F] hover:bg-[#001845] text-white font-medium"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full h-11 text-center text-xl tracking-widest border-gray-300 focus:border-[#001F5F] focus:ring-[#001F5F]"
                />
                <p className="mt-2 text-sm text-gray-500">
                  OTP sent to {formData.phoneNumber} via WhatsApp
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#001F5F] hover:bg-[#001845] text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => {
                    setStep("details");
                    setOtp("");
                    setError("");
                  }}
                >
                  Back to Details
                </Button>
              </div>
            </form>
          )}

          {step === "details" && (
            <>
              {/* Divider */}
              <div className="my-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">Or sign up with</span>
                  </div>
                </div>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50"
                onClick={loginWithGoogle}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              {/* Sign In Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-[#001F5F] hover:underline">
                  Sign in
                </Link>
              </p>

              {/* Security Badge */}
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Your data is safe and secure</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#001F5F] relative overflow-hidden">
        {/* Gradient Glow Effect */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-t from-[#FBC84C]/30 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#FBC84C] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#001F5F]" />
            </div>
            <span className="text-white font-semibold text-lg">CarAccessories</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Start your journey with<br />
            premium car<br />
            accessories
          </h1>
          
          <p className="text-white/70 text-lg max-w-md">
            Create your account and unlock exclusive benefits and personalized shopping experience
          </p>
        </div>
      </div>
    </div>
  );
}
