"use client";

import { useState } from "react";
import { Mail, Phone, Clock, Headphones } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* ✅ MAIN CONTENT WRAPPER */}
      <div className="container mx-auto px-4 max-w-6xl py-10">

        {/* ✅ PAGE HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001F5F]">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-2">
            Have questions or need assistance? We're here to help.
          </p>
        </div>

        {/* ✅ MAIN 2 COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ✅ LEFT SIDE */}
          <div className="space-y-6">

            {/* ✅ HERO IMAGE CARD */}
            <div className="relative overflow-hidden rounded-xl border">
              <Image
                src="/contact-hero.jpg"
                alt="Support"
                width={652}
                height={350}
                className="w-full h-[280px] object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-6 text-white">
                <h3 className="text-xl font-bold">We’re Here to Help</h3>
                <p className="text-sm mt-2 max-w-sm">
                  Our dedicated team is ready to assist with any questions.
                </p>
              </div>
            </div>

            {/* ✅ EMAIL + CALL CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* EMAIL */}
              <div className="bg-[#001F5F] border p-5 rounded-xl flex items-center gap-4">
                <div className="bg-[#FBC84C] p-3 rounded-lg">
                  <Mail className="text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Us</p>
                  <p className="font-semibold text-white">
                    support@exaltride.com
                  </p>
                </div>
              </div>

              {/* CALL */}
              <div className="bg-[#001F5F] border p-5 rounded-xl flex items-center gap-4">
                <div className="bg-[#FBC84C] p-3 rounded-lg">
                  <Phone className="text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <p className="font-semibold text-white">
                    +91 1800-000-000
                  </p>
                </div>
              </div>
            </div>


            {/* ✅ SUPPORT IMAGE */}
            <div className="relative overflow-hidden rounded-xl border">
              <Image
                src="/contact-support.jpg"
                alt="Quick support"
                width={652}
                height={350}
                className="w-full h-[240px] object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-1.5 rounded-lg text-xs font-semibold">
                Quick Response Time
              </div>
            </div>

            {/* ✅ INFO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 flex items-center gap-3">
                <Clock className="text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Business Hours</p>
                  <p className="text-xs text-gray-600">
                    Mon–Sat • 9AM – 6PM
                  </p>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-3">
                <Headphones className="text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">24/7 Support</p>
                  <p className="text-xs text-gray-600">
                    Chat & Email Available
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* ✅ RIGHT SIDE — FORM */}
          <div className="bg-white p-8 rounded-xl shadow-sm border h-fit">
            <h2 className="text-xl font-bold text-[#001F5F] mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill out the form below and we’ll get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <Input
                placeholder="Subject (Optional)"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />

              <textarea
                rows={5}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Please provide details about your inquiry..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />

              <div className="bg-yellow-50 text-xs text-gray-700 p-3 rounded">
                We typically respond within 24–48 business hours.
              </div>

              <Button
                type="submit"
                className="w-full bg-[#001F5F] hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
