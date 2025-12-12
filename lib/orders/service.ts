/**
 * Order API service for interacting with the backend order service
 */

import type { Order, OrderDetails, CreateOrderData, OrdersResponse, OrderDetailsResponse } from './types';

const API_BASE_URL = "https://vais35g209.execute-api.ap-south-1.amazonaws.com/prod";

/**
 * Get auth headers for order API requests
 */
function getOrderHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData, token: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/v1/orders`, {
    method: "POST",
    headers: getOrderHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create order: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get all orders for the authenticated user
 */
export async function getAllOrders(token: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/v1/orders`, {
    method: "GET",
    headers: getOrderHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch orders: ${response.statusText}`);
  }

  const result: OrdersResponse = await response.json();
  return result.data || [];
}

/**
 * Get order details by order ID
 */
export async function getOrderDetails(orderId: string, token: string): Promise<OrderDetails> {
  const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}`, {
    method: "GET",
    headers: getOrderHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch order details: ${response.statusText}`);
  }

  const result: OrderDetailsResponse = await response.json();
  return result.data;
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: getOrderHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to cancel order: ${response.statusText}`);
  }
}

/**
 * Helper to format order status for display
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    packed: 'Packed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
}

/**
 * Helper to get status color classes
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Helper to format date
 */
export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Helper to format currency
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
