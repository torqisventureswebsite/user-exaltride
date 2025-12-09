import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#000B5C] to-[#000842] text-white">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image src="/images/logo.png" alt="Exaltride Logo" width={120} height={40} />
              <p className="text-[10px] md:text-xs text-gray-400 tracking-widest mt-1">YOUR RIDE. REINVENTED.</p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              ExaltRide — your car&apos;s online upgrade hub. Everything you need, all in one place.
            </p>
          </div>

          {/* Quicklinks - with border box */}
          <div className="border border-white/20 bg-white/5 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Quicklinks
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products?type=deals" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policy - with border box */}
          <div className="border border-white/20 bg-white/5  rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Help & Policy
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#shipping-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#return-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#cancellation-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us - with border box */}
          <div className="border border-white/20 bg-white/5 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@autoessentials.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                  support@autoessentials.com
                </a>
              </li>
              <li>
                <a
                  href="tel:1800-123-4567"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 text-gray-400" />
                  1800-123-4567
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  502, 5th Floor, Skyline Plaza,<br />
                  MG Road, Bengaluru 560001, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border border-white/20 bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Newsletter Text */}
          <div className="flex items-center gap-4">
            <div className="bg-[#1a2a7a] p-3 rounded-full">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Stay Updated!</h4>
              <p className="text-gray-400 text-sm">
                Join our mailing list for exclusive deals...
              </p>
            </div>
          </div>

          {/* Newsletter Input */}
          <form className="flex w-full md:w-auto md:min-w-[400px]">
            <div className="flex-1 flex items-center bg-[#0a1654] rounded-l-full px-4 py-2 border border-[#1a2a7a]">
              <Mail className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors -ml-2"
              aria-label="Subscribe"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/10">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © 2025 Auto Essentials. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-[#1a2a7a] hover:bg-[#2a3a8a] rounded-full transition-colors flex-shrink-0"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
