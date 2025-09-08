import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import StatusCard from "@/components/ui/StatusCard";
import Header from "@/components/Header"; // ⬅️ import reusable header
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchOrdersFromDB, Order } from "@/lib/orders";

export default function HomeScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

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

  const loadOrders = async () => {
    setLoading(true);
    const newOrders = await fetchOrdersFromDB();
    setOrders(newOrders.sort((a, b) => (a.date < b.date ? 1 : -1)));
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  const freshOrders = orders.filter((o) => o.status === "Order Confirmed");

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Dashboard" showBack={false} backgroundColor="#00aaff" />

      {/* Status Cards */}
      <View style={styles.statusCardRow}>
        <TouchableOpacity
          style={styles.statusCardWrapper}
          onPress={() => router.push("/home/processing")}
        >
          <StatusCard
            icon="sync-outline"
            label="Processing"
            count={orders.filter((o) => o.status === "Processing").length}
            color="#3498db"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusCardWrapper}
          onPress={() => router.push("/home/delivery")}
        >
          <StatusCard
            icon="cube-outline"
            label="For Delivery"
            count={orders.filter((o) => o.status === "For Delivery").length}
            color="#9b59b6"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusCardWrapper}
          onPress={() => router.push("/home/completed")}
        >
          <StatusCard
            icon="checkmark-done-outline"
            label="Completed"
            count={orders.filter((o) => o.status === "Completed").length}
            color="#2ecc71"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusCardWrapper}
          onPress={() => router.push("/home/rejected")}
        >
          <StatusCard
            icon="ban-outline"
            label="Rejected"
            count={orders.filter((o) => o.status === "Rejected").length}
            color="#e74c3c"
          />
        </TouchableOpacity>
      </View>

      {/* Title outside scroll */}
      <Text style={styles.sectionTitle}>New Laundry Orders</Text>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadOrders} />
        }
      >
        {freshOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onUpdateStatus={updateOrderStatus}
          />
        ))}

        {freshOrders.length === 0 && (
          <Text style={styles.noOrdersText}>
            🎉 No new orders to review!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

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
      <Text style={styles.orderId}>{order.orderId}</Text>
      <Text style={styles.orderText}>
        {order.customer} placed a laundry order.
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
              params: { orderId: order.orderId, customer: order.customer },
            })
          }
        >
          <Text style={styles.buttonText}>✗ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContainer: { padding: 16 },

  statusCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusCardWrapper: {
    width: "22%",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 8,
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

  noOrdersText: { textAlign: "center", color: "#666", marginTop: 30 },
});
