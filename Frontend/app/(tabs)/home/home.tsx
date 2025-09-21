// screens/home.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import StatusCard from "@/components/ui/StatusCard";
import Header from "@/components/Header";
import { fetchOrders, updateOrderStatus, Order } from "@/lib/orders";
import { getCurrentUser } from "@/lib/auth";

export default function HomeScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // ✅ Get the logged-in user's data directly
  const user = getCurrentUser();
  const shopId = user?.ShopID; // Get the shopId from the user object

  const loadOrders = useCallback(async () => {
    if ( shopId ) {
      setLoading(true);
      const fetchedOrders = await fetchOrders(shopId);
      setOrders(fetchedOrders);
      setLoading(false);
    }
  }, [shopId]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      await loadOrders(); 
    } else {
      Alert.alert("Error", "Failed to update order status.");
    }
  };
  
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
          onPress={() => router.push({ 
            pathname: "/home/processing", 
            params: { shopId: shopId } 
          })}
        />
        <StatusCardLink
          icon="cube-outline"
          label="For Delivery"
          count={getOrderStatusCount("For Delivery")}
          color="#9b59b6"
          onPress={() => router.push({ 
            pathname: "/home/forDelivery", 
            params: { shopId: shopId } 
          })}
        />
        <StatusCardLink
          icon="checkmark-done-outline"
          label="Completed"
          count={getOrderStatusCount("Completed")}
          color="#2ecc71"
          onPress={() => router.push({ 
            pathname: "/home/completed", 
            params: { shopId: shopId } 
          })}
        />
        <StatusCardLink
          icon="ban-outline"
          label="Rejected"
          count={getOrderStatusCount("Rejected")}
          color="#e74c3c"
          onPress={() => router.push({ 
            pathname: "/home/rejected", 
            params: { shopId: shopId } 
          })}
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
              onUpdateStatus={handleStatusUpdate}
              // ✅ Pass the shopId down to the OrderCard component
              shopId={shopId as string}
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

const StatusCardLink = ({ icon, label, count, color, onPress }: any) => (
  <TouchableOpacity style={styles.statusCardWrapper} onPress={onPress}>
    <StatusCard icon={icon} label={label} count={count} color={color} />
  </TouchableOpacity>
);


function OrderCard({
  order,
  onUpdateStatus,
  shopId, 
}: {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
  shopId: string; 
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
            pathname: "/home/orderDetail",
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
              params: { 
                orderId: order.orderId, 
                customer: order.customerName, 
                shopId: shopId 
              },
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