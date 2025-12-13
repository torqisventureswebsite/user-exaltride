/**
 * Order types for the order management system
 */

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendorName?: string;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  currency?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface OrderDetails extends Order {
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CreateOrderData {
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  total: number;
  currency: string;
  paymentMethod: string;
  shippingAddress?: ShippingAddress;
}

export interface OrdersResponse {
  data: Order[];
}

export interface OrderDetailsResponse {
  data: OrderDetails;
}
