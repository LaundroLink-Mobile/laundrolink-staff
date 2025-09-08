import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; 
import { fetchOrdersFromDB, Order } from "@/lib/orders";
import Header from "@/components/Header"; 

interface StatusScreenProps {
  title: string;
  statusKey: string | string[];
  showUpdate?: boolean;
}

export default function StatusScreen({ title, statusKey, showUpdate = true }: StatusScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  // ✅ Re-fetch orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        const allOrders = await fetchOrdersFromDB();

        const filtered = Array.isArray(statusKey)
          ? allOrders.filter((o) => statusKey.includes(o.status))
          : allOrders.filter((o) => o.status === statusKey);

        setOrders(filtered);
      };
      loadOrders();
    }, [statusKey])
  );

  return (
    <View style={styles.container}>
      <Header title={title} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {orders.map((order) => (
          <View key={order.orderId} style={styles.card}>
            {/* Order ID */}
            <Text style={styles.orderId}>#{order.orderId}</Text>
            {/* Customer */}
            <Text style={styles.customer}>{order.customer}</Text>

            {/* View Details */}
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

            {/* ✅ Bottom row with Status + Update */}
            <View style={styles.bottomRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>

              {showUpdate && (
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/home/updateOrder",
                      params: {
                        orderId: order.orderId,
                        customer: order.customer,
                        currentStatus: order.status,
                      },
                    })
                  }
                >
                  <Text style={styles.updateText}>Update Laundry</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {orders.length === 0 && (
          <Text style={styles.noOrders}>No {title.toLowerCase()} orders.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  orderId: { fontSize: 15, fontWeight: "700", color: "#333" },
  customer: { fontSize: 16, fontWeight: "600", color: "#222", marginBottom: 4 },

  viewDetails: {
    color: "#1A73E8",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
  },
  statusText: { color: "#333", fontWeight: "600", fontSize: 12 },

  updateBtn: {
    backgroundColor: "#4da6ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  updateText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  noOrders: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
