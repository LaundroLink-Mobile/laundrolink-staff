export interface Order {
  orderId: string;
  customer: string;
  status: string;
  phone: string;
  subtotal: number;
  fee: number;
  total: number;
  date: string;
  deliveryType: string;
  address: string;
  reason?: string; // only for rejected
  note?: string;   // only for rejected
  weight?: number; // ✅ new field (kg)
}

/* ---------------- Mock Database ---------------- */
let orders: Order[] = [
  // ✅ New Orders
  {
    orderId: "#LAU123456",
    customer: "MJ D.",
    status: "Order Confirmed",
    phone: "0917-123-4567",
    subtotal: 400,
    fee: 50,
    total: 450,
    date: "18 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "123 Jasmine St., Cebu City",
    weight: 8, // ✅ 8kg * 50 = ₱400
  },
  {
    orderId: "#PEN983745",
    customer: "Ella Cruz",
    status: "Order Confirmed",
    phone: "0918-456-7890",
    subtotal: 500,
    fee: 60,
    total: 560,
    date: "21 Apr 2025",
    deliveryType: "Pickup Only",
    address: "7th Avenue, Cebu IT Park",
    weight: 10,
  },
  {
    orderId: "#PEN564738",
    customer: "Mark Reyes",
    status: "Order Confirmed",
    phone: "0916-234-6789",
    subtotal: 280,
    fee: 35,
    total: 315,
    date: "22 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "Sunflower St., Mandaue City",
    weight: 5.6,
  },
  {
    orderId: "#PEN837465",
    customer: "Karla S.",
    status: "Order Confirmed",
    phone: "0917-444-5555",
    subtotal: 390,
    fee: 45,
    total: 435,
    date: "23 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Colon St., Cebu City",
    weight: 7.8,
  },

  // 🔄 Processing
  {
    orderId: "#AUN973456",
    customer: "Jasper B.",
    status: "Processing",
    phone: "0922-987-6543",
    subtotal: 300,
    fee: 40,
    total: 340,
    date: "19 Apr 2025",
    deliveryType: "Pickup Only",
    address: "456 Mango Ave., Cebu City",
    weight: 6,
  },
  {
    orderId: "#PRO192837",
    customer: "Daniel Lee",
    status: "Processing",
    phone: "0919-222-1111",
    subtotal: 620,
    fee: 70,
    total: 690,
    date: "22 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "Banilad Town Center, Cebu",
    weight: 12.4,
  },
  {
    orderId: "#PRO837465",
    customer: "Anna Mae",
    status: "Processing",
    phone: "0917-999-8888",
    subtotal: 350,
    fee: 40,
    total: 390,
    date: "23 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Talamban, Cebu City",
    weight: 7,
  },

  // ✅ Completed
  {
    orderId: "#COM927648",
    customer: "Mikha Lim",
    status: "Completed",
    phone: "0998-765-4321",
    subtotal: 350,
    fee: 45,
    total: 395,
    date: "17 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "Ayala Center Cebu",
    weight: 7,
  },
  {
    orderId: "#COM564738",
    customer: "Sophia Cruz",
    status: "Completed",
    phone: "0920-333-4444",
    subtotal: 470,
    fee: 55,
    total: 525,
    date: "16 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Capitol Site, Cebu City",
    weight: 9.4,
  },
  {
    orderId: "#COM847362",
    customer: "Ryan P.",
    status: "Completed",
    phone: "0917-123-9876",
    subtotal: 520,
    fee: 60,
    total: 580,
    date: "15 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "Guadalupe, Cebu City",
    weight: 10.4,
  },

  // 📦 For Delivery
  {
    orderId: "#PAU123456",
    customer: "Juriel G.",
    status: "For Delivery",
    phone: "0991-123-4567",
    subtotal: 430,
    fee: 56,
    total: 486,
    date: "20 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "01K Mars St., Universe City",
    weight: 8.6,
  },
  {
    orderId: "#DEL192837",
    customer: "Chris Martinez",
    status: "For Delivery",
    phone: "0917-111-2222",
    subtotal: 600,
    fee: 70,
    total: 670,
    date: "21 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Basak, Lapu-Lapu City",
    weight: 12,
  },
  {
    orderId: "#DEL827364",
    customer: "Maria S.",
    status: "For Delivery",
    phone: "0922-555-7777",
    subtotal: 710,
    fee: 80,
    total: 790,
    date: "23 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "SRP, Cebu City",
    weight: 14.2,
  },
  {
    orderId: "#DEL473829",
    customer: "Leo Tan",
    status: "For Delivery",
    phone: "0918-222-3333",
    subtotal: 330,
    fee: 40,
    total: 370,
    date: "22 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Talisay City, Cebu",
    weight: 6.6,
  },

  // ❌ Rejected (sample)
  {
    orderId: "#REJ192837",
    customer: "Paula M.",
    status: "Rejected",
    phone: "0917-222-3333",
    subtotal: 380,
    fee: 40,
    total: 420,
    date: "20 Apr 2025",
    deliveryType: "Pickup Only",
    address: "Lahug, Cebu City",
    reason: "Invalid address",
    note: "Street name not found",
    weight: 7.6,
  },
  {
    orderId: "#REJ564738",
    customer: "Kevin L.",
    status: "Rejected",
    phone: "0918-444-5555",
    subtotal: 450,
    fee: 50,
    total: 500,
    date: "21 Apr 2025",
    deliveryType: "Pickup & Delivery",
    address: "Banawa, Cebu City",
    reason: "Customer unavailable",
    note: "No one responded during pickup",
    weight: 9,
  },
];

/* ---------------- API-like Functions ---------------- */

// Fetch all orders
export const fetchOrdersFromDB = async (): Promise<Order[]> => {
  return orders;
};

// Update order status (with optional reason/note for rejection)
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  reason?: string,
  note?: string
): Promise<void> => {
  orders = orders.map((o) =>
    o.orderId === orderId ? { ...o, status, reason, note } : o
  );
};

// Reset mock DB (for testing/demo)
export const resetOrders = async (): Promise<void> => {
  // You could reassign `orders` to the original seed data if needed
};

// ✅ Update order price manually
export const updateOrderPrice = async (
  orderId: string,
  newSubtotal: number,
  newFee?: number
): Promise<void> => {
  orders = orders.map((o) =>
    o.orderId === orderId
      ? {
          ...o,
          subtotal: newSubtotal,
          fee: newFee ?? o.fee,
          total: newSubtotal + (newFee ?? o.fee),
        }
      : o
  );
};

// ✅ Update order weight (auto-calculates price)
export const updateOrderWeight = async (
  orderId: string,
  newWeight: number
): Promise<Order | null> => {
  const pricePerKg = 50; // 💡 Set your price per kg here
  let updatedOrder: Order | null = null;

  orders = orders.map((o) => {
    if (o.orderId === orderId) {
      const newSubtotal = newWeight * pricePerKg;
      updatedOrder = {
        ...o,
        weight: newWeight,
        subtotal: newSubtotal,
        total: newSubtotal + o.fee,
      };
      return updatedOrder;
    }
    return o;
  });

  return updatedOrder;
};
