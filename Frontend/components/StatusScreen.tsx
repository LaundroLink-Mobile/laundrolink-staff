// components/StatusScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { fetchOrders, Order } from "@/lib/orders"; // ✅ Import the correct function and type
import Header from "@/components/Header";

interface StatusScreenProps {
  title: string;
  statusKey: string | string[];
  showUpdate?: boolean;
}

export default function StatusScreen({ title, statusKey, showUpdate = true }: StatusScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state for better UX
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        setLoading(true);
        const allOrders = await fetchOrders(); // ✅ Use the correct API function

        // Filter based on whether statusKey is a single string or an array of strings
        const filtered = Array.isArray(statusKey)
          ? allOrders.filter((o) => statusKey.includes(o.status))
          : allOrders.filter((o) => o.status === statusKey);

        setOrders(filtered);
        setLoading(false); // ✅ Stop loading
      };
      loadOrders();
    }, [statusKey]) // Dependency array ensures this runs when the statusKey changes
  );

  return (
    <View style={styles.container}>
      <Header title={title} />

      {loading ? (
        <ActivityIndicator size="large" color="#00aaff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.orderId} style={styles.card}>
                <Text style={styles.orderId}>#{order.orderId}</Text>
                <Text style={styles.customer}>{order.customerName}</Text> {/* ✅ Use customerName */}

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
                            customer: order.customerName, // ✅ Use customerName
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
            ))
          ) : (
            <Text style={styles.noOrders}>No {title.toLowerCase()} orders found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// Styles (no changes needed, but included for completeness)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  customer: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  viewDetails: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  statusBadge: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  updateBtn: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6c757d',
  },
});