// rejectMessage.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateOrderStatus } from "@/lib/orders";
import Header from "@/components/Header";

export default function RejectOrderScreen() {
  const { orderId, customer, shopId } = useLocalSearchParams<{ orderId: string; customer: string; shopId: string}>();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!reason) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }

    // This call now correctly sends all the data to the backend
    const success = await updateOrderStatus(orderId, "Rejected", reason, note);

    if (success) {
      // Navigate back to the main dashboard after rejecting
      // The home screen will refresh automatically with useFocusEffect
      router.replace({
        pathname: "/home/home",
        params: { shopId: shopId },
      }); 
    } else {
      Alert.alert("Error", "Failed to reject order.");
    }
  };

  // ✅ This function now simply goes back to the previous screen
  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Reject Order" />
      <View style={styles.card}>
        <Text style={styles.title}>Reject Order</Text>
        <Text style={styles.orderId}>Order #{orderId}</Text>
        <Text style={styles.customer}>{customer}</Text>

        <Text style={styles.label}>Reason:</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="e.g., Out of service area, Items damaged"
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
          style={[styles.button, { backgroundColor: "#c82333" }]} // Changed to red
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
  card: { margin: 20, marginTop: 20, padding: 20, backgroundColor: "#fff", borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  customer: { fontSize: 16, color: '#555', marginBottom: 20 },
  label: { fontWeight: "600", marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 5, backgroundColor: "#fff", textAlignVertical: 'top' },
  button: { marginTop: 15, padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});