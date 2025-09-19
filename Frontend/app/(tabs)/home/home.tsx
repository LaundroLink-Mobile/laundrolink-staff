// screens/home.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import StatusCard from "@/components/ui/StatusCard";
import Header from "@/components/Header";
import { fetchOrders, Order } from "@/lib/orders"; // ✅ Import from the new lib file

export default function HomeScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Centralized function to load orders using the lib function
  const loadOrders = useCallback(async () => {
    setLoading(true);
    const fetchedOrders = await fetchOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // This function now only updates the local state.
  // A real implementation would also call an API to persist the change.
  const updateOrderStatus = (
    orderId: string,
    newStatus: string,
    reason?: string,
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus, reason, note } : o
      )
    );
  };
  
  // Effect to handle status updates coming from other screens
  useEffect(() => {
    if (params?.orderId && params?.status) {
      updateOrderStatus(
        String(params.orderId),
        String(params.status),
        params.reason ? String(params.reason) : undefined,
        params.note ? String(params.note) : undefined
      );
    }
  }, [params]);

  const getOrderStatusCount = (status: string) => {
    return orders.filter((o) => o.status === status).length;
  };

  const freshOrders = orders.filter((o) => o.status === "Pending");

  return (
    <View style={styles.container}>
      <Header title="Dashboard" showBack={false} backgroundColor="#00aaff" />

      {/* Status Cards */}
      <View style={styles.statusCardRow}>
        <StatusCardLink
          icon="sync-outline"
          label="Processing"
          count={getOrderStatusCount("Processing")}
          color="#3498db"
          onPress={() => router.push("/home/processing")}
        />
        <StatusCardLink
          icon="cube-outline"
          label="For Delivery"
          count={getOrderStatusCount("For Delivery")}
          color="#9b59b6"
          onPress={() => router.push("/home/forDelivery")}
        />
        <StatusCardLink
          icon="checkmark-done-outline"
          label="Completed"
          count={getOrderStatusCount("Completed")}
          color="#2ecc71"
          onPress={() => router.push("/home/completed")}
        />
        <StatusCardLink
          icon="ban-outline"
          label="Rejected"
          count={getOrderStatusCount("Rejected")}
          color="#e74c3c"
          onPress={() => router.push("/home/rejected")}
        />
      </View>

      <Text style={styles.sectionTitle}>New Laundry Orders</Text>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadOrders} />
        }
      >
        {freshOrders.length > 0 ? (
          freshOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onUpdateStatus={updateOrderStatus}
            />
          ))
        ) : (
          <Text style={styles.noOrdersText}>
            🎉 No new orders to review!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

// Reusable component for Status Cards to reduce repetition
const StatusCardLink = ({ icon, label, count, color, onPress }: any) => (
  <TouchableOpacity style={styles.statusCardWrapper} onPress={onPress}>
    <StatusCard icon={icon} label={label} count={count} color={color} />
  </TouchableOpacity>
);


function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>#{order.orderId}</Text>
      <Text style={styles.orderText}>
        Customer {order.customerName} placed a laundry order.
      </Text>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/home/orderdetail",
            params: { orderId: order.orderId },
          })
        }
      >
        <Text style={styles.viewDetails}>View Details</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.acceptBtn]}
          onPress={() => onUpdateStatus(order.orderId, "Processing")}
        >
          <Text style={styles.buttonText}>✓ Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectBtn]}
          onPress={() =>
            router.push({
              pathname: "/home/rejectMessage",
              params: { orderId: order.orderId, customer: order.customerName },
            })
          }
        >
          <Text style={styles.buttonText}>✗ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles (no changes needed) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContainer: { padding: 16, flexGrow: 1 },
  statusCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 5,
    color: "#111",
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderId: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  orderText: { fontSize: 14, color: "#333", marginBottom: 8 },
  viewDetails: {
    fontSize: 13,
    color: "#3498db",
    marginBottom: 10,
    fontWeight: "500",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptBtn: { backgroundColor: "green" },
  rejectBtn: { backgroundColor: "darkred" },
  buttonText: { color: "#fff", fontWeight: "600" },
  noOrdersText: { textAlign: "center", color: "#666", marginTop: 40, fontSize: 16 },
});