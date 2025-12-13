"use client";

import { useState } from "react";
import { Pencil, Trash2, Star, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 98765 43210",
    addressLine1: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    isDefault: true,
  }
];

export function YourAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (confirmed) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleSaveAddress = (address: Address) => {
    if (editingAddress) {
      setAddresses(addresses.map((a) => (a.id === address.id ? address : a)));
    } else {
      setAddresses([...addresses, { ...address, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  return (
    <div className="space-y-6">
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Addresses Saved</h3>
          <p className="text-gray-600">
            You can add a new address during checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Default Address */}
          {defaultAddress && (
            <AddressCard
              address={defaultAddress}
              onEdit={() => handleEdit(defaultAddress)}
              onDelete={() => handleDelete(defaultAddress.id)}
              onSetDefault={() => {}}
            />
          )}

          {/* Other Addresses */}
          {otherAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Address Modal - only for editing existing addresses */}
      {isModalOpen && editingAddress && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
        />
      )}
    </div>
  );
}

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg border p-4",
      address.isDefault ? "border-yellow-400" : "border-gray-200"
    )}>
      {address.isDefault && (
        <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium mb-2">
          <Star size={14} className="fill-yellow-400" />
          Default Address
        </div>
      )}
      
      <h4 className="font-semibold text-gray-900">{address.name}</h4>
      <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
      {address.addressLine2 && (
        <p className="text-sm text-gray-600">{address.addressLine2}</p>
      )}
      <p className="text-sm text-gray-600">
        {address.city}, {address.state} - {address.postalCode}
      </p>
      <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star size={14} />
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}

interface AddressModalProps {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

function AddressModal({ address, onClose, onSave }: AddressModalProps) {
  const [form, setForm] = useState<Omit<Address, "id" | "isDefault">>({
    name: address?.name || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: address?.id || "",
      ...form,
      isDefault: address?.isDefault || false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={form.addressLine1}
              onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
              placeholder="House No., Building Name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={form.addressLine2}
              onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
              placeholder="Road name, Area, Colony (Optional)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              placeholder="400001"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F5F] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#001F5F] hover:bg-[#001845] text-white font-medium rounded-lg transition-colors"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
