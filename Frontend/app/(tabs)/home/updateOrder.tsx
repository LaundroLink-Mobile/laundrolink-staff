import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateOrderStatus } from "@/lib/orders";
import Header from "@/components/Header";

const statusOptions = ["Washed", "Steam Pressed/Ironed", "Folded", "Out for Delivery"];

// Define the order of steps
const statusFlow: Record<string, string | null> = {
  Washed: null, // First step
  "Steam Pressed/Ironed": "Washed",
  Folded: "Steam Pressed/Ironed",
  "Out for Delivery": "Folded"
};

export default function UpdateOrder() {
  const { orderId, customer, currentStatus } = useLocalSearchParams<{
    orderId: string;
    customer: string;
    currentStatus: string;
  }>();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!selectedStatus) {
      Alert.alert("Please select a status");
      return;
    }

    // ✅ Check sequence rule
    const requiredPrev = statusFlow[selectedStatus];
    if (requiredPrev && currentStatus !== requiredPrev) {
      Alert.alert(
        "Invalid Step",
        `You must mark the order as "${requiredPrev}" before moving to "${selectedStatus}".`
      );
      return;
    }

    // ✅ Update DB
    await updateOrderStatus(orderId, selectedStatus);

    // ✅ Just go back – Processing will re-fetch automatically
    router.replace("/home/processing");
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <Header title="Update Laundry" />

      {/* Card for content */}
      <View style={styles.card}>
        <Text style={styles.title}>Order #{orderId}</Text>
        <Text style={styles.subtitle}>Customer: {customer}</Text>

        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.option, selectedStatus === status && styles.selected]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.optionText,
                selectedStatus === status && styles.optionTextSelected,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" }, // ✅ light background
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // ✅ shadow for Android
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 20 },
  option: {
    backgroundColor: "#89CFF0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selected: { backgroundColor: "#1A4D9D" },
  optionText: { color: "#000", fontSize: 16, fontWeight: "600" },
  optionTextSelected: { color: "#fff" },
  saveButton: {
    backgroundColor: "#1A4D9D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
