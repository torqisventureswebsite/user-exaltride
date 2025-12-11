"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyOtp, loginWithGoogle } = useAuth();
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const sessionId = await login(phoneNumber);
      setSession(sessionId);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtp(phoneNumber, session, otp);
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
      setPhoneNumber("+91");
    } else {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#001F5F] relative overflow-hidden">
        {/* Gradient Glow Effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-b from-[#FBC84C]/30 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#FBC84C] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#001F5F]" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Welcome back,<br />
            to your favorite<br />
            car accessories store
          </h1>
          
          <p className="text-white/70 text-lg">
            Sign in to continue shopping and manage your orders
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to<br />your account
            </h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Whatsapp Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phoneNumber}
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
                {loading ? "Sending OTP..." : "Send OTP"}
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
                  OTP sent to {phoneNumber} via WhatsApp
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
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                >
                  Change Phone Number
                </Button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 border-gray-300 hover:bg-gray-50"
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
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#001F5F] hover:underline">
              Sign up for free
            </Link>
          </p>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure login with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
