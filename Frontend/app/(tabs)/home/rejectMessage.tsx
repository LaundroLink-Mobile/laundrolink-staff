import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { updateOrderStatus } from "@/lib/orders";
import Header from "@/components/Header";

export default function RejectOrderScreen() {
  const { orderId, customer } = useLocalSearchParams<{ orderId: string; customer: string }>();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!reason) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }

    // ✅ Store reason and note separately
    await updateOrderStatus(orderId, "Rejected", reason, note);

    router.replace("/home/rejected");
  };

  const handleCancel = async () => {
    await updateOrderStatus(orderId, "Order Confirmed");
    router.replace("/home/home");
  };

  return (
    <View style={styles.container}>
        {/* Unified Header */}
        <Header title="Reject Order" />

      {/* Content */}
      <View style={styles.card}>
        <Text style={styles.title}>Reject Order</Text>
        <Text style={styles.orderId}>Order {orderId}</Text>
        <Text style={styles.customer}>{customer}</Text>

        <Text style={styles.label}>Reason:</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Enter rejection reason"
          style={styles.input}
        />

        <Text style={styles.label}>Note (optional):</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add details..."
          multiline
          style={[styles.input, { height: 80 }]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0077b6" }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit Rejection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "gray" }]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  card: {
    margin: 20,
    marginTop: 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  customer: { fontSize: 16, marginBottom: 2 },
  label: { fontWeight: "600", marginTop: 30, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 40,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
