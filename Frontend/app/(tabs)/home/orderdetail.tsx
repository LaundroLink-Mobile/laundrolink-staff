import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchOrdersFromDB, Order } from "@/lib/orders";
import Header from "@/components/Header"; 

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const allOrders = await fetchOrdersFromDB();
      const found = allOrders.find((o) => o.orderId === orderId) || null;
      setOrder(found);
      setLoading(false);
    };
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
        <Header title="Order Details" backgroundColor="#00aaff" />

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.customer}>{order.customer}</Text>
        <Text style={styles.subText}>{order.phone}</Text>
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <Text style={styles.normalText}>
          Order ID: {order.orderId} {"     "} {order.date}
        </Text>
      </View>

      {/* Weight Section */}
      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Laundry Weight</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/editWeight",
                params: { orderId: order.orderId, prevWeight: order.weight },
              })
            }
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.normalText}>{order.weight} kg</Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <Text style={styles.normalText}>Subtotal: ₱{order.subtotal}</Text>
        <Text style={styles.normalText}>Delivery Fee: ₱{order.fee}</Text>
        <Text style={styles.totalText}>Total: ₱{order.total}</Text>
      </View>

      {/* Delivery Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <Text style={styles.normalText}>Type: {order.deliveryType}</Text>
        <Text style={styles.normalText}>Address: {order.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#89CFF0",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backBtn: { marginRight: 12 },
  headerText: { fontSize: 20, fontWeight: "bold" },

  section: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  customer: { fontSize: 18, fontWeight: "600" },
  subText: { fontSize: 15, color: "#555" },
  normalText: { fontSize: 15, color: "#222", marginBottom: 4 },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
