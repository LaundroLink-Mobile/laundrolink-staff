import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

// If you already have Button in components/ui/Button, we can reuse it.
// Otherwise, I’ll just use TouchableOpacity for Accept/Reject buttons.

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>DASHBOARD</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard label="Pending" count={10} />
          <StatusCard label="Processing" count={5} />
          <StatusCard label="Completed" count={3} />
          <StatusCard label="For delivery" count={3} />
        </View>

        {/* New Laundry Orders */}
        <Text style={styles.sectionTitle}>New Laundry Orders</Text>

        <OrderCard
          orderId="#LAU123456"
          customer="MJ D."
          status="Order Confirmed"
        />
        <OrderCard
          orderId="#AUN973456"
          customer="Jasper B."
          status="Order Confirmed"
        />
      </ScrollView>
    </View>
  );
}

/* ------------------------------
   Components
--------------------------------*/

function StatusCard({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusCount}>{count}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

function OrderCard({
  orderId,
  customer,
  status,
}: {
  orderId: string;
  customer: string;
  status: string;
}) {
  return (
    <View style={styles.orderCard}>
      <Text style={styles.orderStatus}>{status}</Text>
      <Text style={styles.orderId}>{orderId}</Text>
      <Text style={styles.orderText}>{customer} placed a laundry order.</Text>

      <Text style={styles.viewDetails}>View Details</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.acceptBtn]}>
          <Text style={styles.buttonText}>✓ Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rejectBtn]}>
          <Text style={styles.buttonText}>✗ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------------------------
   Styles
--------------------------------*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: "#89CFF0",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#e8f4fb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  statusLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderStatus: {
    color: "green",
    fontWeight: "600",
    marginBottom: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  orderText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  viewDetails: {
    fontSize: 12,
    color: "#0066cc",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptBtn: {
    backgroundColor: "green",
  },
  rejectBtn: {
    backgroundColor: "darkred",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
