import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import FooterSection from "./FooterSection";

export default function Footer() {
  const quicklinks = [
    { label: "Home" },
    { label: "Products" },
    { label: "Deals" },
    { label: "Contact Us" },
  ];

  const policies = [
    { label: "FAQ" },
    { label: "Shipping Policy" },
    { label: "Return Policy" },
    { label: "Cancellation Policy" },
    { label: "Privacy Policy" },
    { label: "Terms & Conditions" },
  ];

  const contact = [
    { label: "support@autoessentials.com", icon: <Mail size={16} /> },
    { label: "1800-123-4567", icon: <Phone size={16} /> },
    {
      label: "502, 5th Floor, Skyline Plaza, MG Road, Bengaluru 560001, India",
      icon: <MapPin size={16} />,
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#041E6E] to-[#020C3A] text-white pt-10 pb-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-blue-400/20 pb-10 text-center sm:text-left">
          {/* Logo */}
          <div className="flex flex-col items-center sm:items-start">
            <img src="/images/logo.png" alt="Exaltride Logo" className="h-10 mb-3" />
            <p className="text-sm text-gray-300 leading-relaxed max-w-[240px] mx-auto sm:mx-0">
              Your trusted destination for premium car accessories
            </p>
          </div>

          <FooterSection title="Quicklinks" items={quicklinks} />
          <FooterSection title="Help & Policy" items={policies} />
          <FooterSection title="Contact Us" items={contact} />
        </div>

        {/* Newsletter */}
        <div className="mt-10 border-b border-blue-400/20 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-[#0E1F7A]/60 px-5 sm:px-8 py-5 rounded-xl text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
              <Mail className="text-yellow-400 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold text-yellow-400 text-base sm:text-lg">
                  Stay Updated!
                </h4>
                <p className="text-gray-300 text-sm">
                  Join our mailing list for exclusive deals.
                </p>
              </div>
            </div>
            <form className="flex w-full md:w-auto justify-center md:justify-end">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-full text-blue-900 bg-amber-50 text-sm w-3/4 sm:w-72 outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium px-5 rounded-r-full transition flex items-center justify-center"
              >
                ➤
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm text-center md:text-left">
          <p className="order-2 md:order-1">
            © 2025 Auto Essentials. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-6 order-1 md:order-2">
            <a href="#" className="text-white hover:text-yellow-400 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
