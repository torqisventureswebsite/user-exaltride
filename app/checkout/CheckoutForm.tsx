"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, MapPin, User, Mail, Phone } from "lucide-react";

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    alert("Order placed successfully! (This is a demo)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" type="text" placeholder="John" required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" type="text" placeholder="Doe" required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main Street, Apartment 4B"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" type="text" placeholder="Mumbai" required />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" type="text" placeholder="Maharashtra" required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">PIN Code *</Label>
              <Input id="zipCode" type="text" placeholder="400001" required />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input id="country" type="text" placeholder="India" defaultValue="India" required />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h2>

        {/* Payment Options */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value as "card")}
              className="w-4 h-4"
            />
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Credit/Debit Card</span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value as "upi")}
              className="w-4 h-4"
            />
            <Building2 className="h-5 w-5 text-gray-600" />
            <span className="font-medium">UPI/Net Banking</span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value as "cod")}
              className="w-4 h-4"
            />
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Cash on Delivery</span>
          </label>
        </div>

        {/* Card Details (shown only when card is selected) */}
        {paymentMethod === "card" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input id="expiry" type="text" placeholder="MM/YY" maxLength={5} required />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input id="cvv" type="text" placeholder="123" maxLength={3} required />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name *</Label>
              <Input id="cardName" type="text" placeholder="John Doe" required />
            </div>
          </div>
        )}

        {/* UPI Details */}
        {paymentMethod === "upi" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="upiId">UPI ID *</Label>
              <Input id="upiId" type="text" placeholder="yourname@upi" required />
            </div>
          </div>
        )}

        {/* COD Message */}
        {paymentMethod === "cod" && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p className="text-sm">
              Cash on Delivery available. Please keep exact change ready for smooth delivery.
            </p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <Button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg py-6"
      >
        Place Order
      </Button>
    </form>
  );
}
