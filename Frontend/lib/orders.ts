// lib/orders.ts

// The base URL of your backend API
const API_URL = "http://localhost:8080/api";

// This interface now matches the data structure from your backend
export interface Order {
  orderId: string;
  customerId: string;
  shopId: string;
  serviceId: string;
  laundryDetailId: string;
  deliveryId: string;
  createdAt: string;
  status: string;
  updatedAt: string;
  customerName: string;
  // Optional fields for frontend state management
  reason?: string; 
  note?: string;   
}

/**
 * Fetches all orders from the backend API.
 * @returns A promise that resolves to an array of orders.
 */
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const orders: Order[] = await response.json();
    // Sort orders by creation date, newest first
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return []; // Return an empty array on error to prevent app crashes
  }
};

// You can add other API functions here as needed, like updating an order status.
// For now, we'll keep it focused on fetching.