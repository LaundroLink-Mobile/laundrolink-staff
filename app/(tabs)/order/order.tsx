import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import StatusCard from "@/components/ui/StatusCard";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function OrderScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState("This Week");

  const options = ["Today", "This Week", "This Month", "Customize"];
  const handleSelect = (option) => {
    setSelectedRange(option);
    setMenuVisible(false);
  };

  // Temporary data for the Orders Table
  const orders = [
    { id: "ORD-001", customer: "Alice Johnson", status: "Completed", amount: 499.99 },
    { id: "ORD-002", customer: "Bob Smith", status: "Pending", amount: 259.50 },
    { id: "ORD-003", customer: "Charlie Brown", status: "Completed", amount: 120.00 },
    { id: "ORD-004", customer: "Diana Prince", status: "Cancelled", amount: 89.99 },
    { id: "ORD-005", customer: "Ethan Hunt", status: "Completed", amount: 320.75 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ORDERS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Section */}
        <View style={styles.dateRow}>
          <Text style={styles.sectionTitle}>Date</Text>

          {/* Dropdown */}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <View style={styles.dropdownContent}>
                <Text style={styles.dropdownText}>{selectedRange}</Text>
                <Ionicons name="chevron-down" size={18} color="#0077b6" />
              </View>
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.menu}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.menuItem}
                    onPress={() => handleSelect(option)}
                  >
                    <Text style={styles.menuText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Status Cards */}
        <View style={styles.statusRow}>
          <StatusCard icon="document-text-outline" label="Total" count={159} color="#00aaff" />
          <StatusCard icon="checkmark-circle-outline" label="Completed" count={148} color="#00aaff" />
          <StatusCard icon="time-outline" label="Pending" count={11} color="#00aaff" />
          <StatusCard icon="bar-chart-outline" label="Revenue" count={30067.79} color="#00aaff" />
        </View>

        {/* Revenue Title */}
        <Text style={styles.sectionTitle}>Revenue</Text>

        {/* Temporary Chart */}
        <View style={styles.chartBox}>
            <LineChart
            data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                {
                    data: [500, 800, 1200, 750, 950, 1100, 1400], // mock revenue values
                },
                ],
            }}
            width={screenWidth - 40}
            height={160}
            yAxisLabel="₱"
            yAxisSuffix=""
            chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#0077b6",
                },
            }}
            bezier
            style={{
                borderRadius: 10,
            }}
            />
        </View>

        {/* Export Buttons */}
        <View style={styles.exportRow}>
          <View style={[styles.exportBtn, { backgroundColor: "#00aaff" }]}>
            <Text style={styles.exportText}>Export PDF</Text>
          </View>
          <View style={[styles.exportBtn, { backgroundColor: "#00aaff" }]}>
            <Text style={styles.exportText}>Export Excel</Text>
          </View>
        </View>

        {/* Orders Table */}
        <View style={styles.tableBox}>
          <Text style={styles.tableTitle}>📋 Orders Table</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Order ID</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Customer</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Status</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
          </View>
          {orders.map((order, index) => (
            <View
              key={order.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={styles.tableCell}>{order.id}</Text>
              <Text style={styles.tableCell}>{order.customer}</Text>
              <Text
                style={[
                  styles.tableCell,
                  { color: order.status === "Completed" ? "green" : order.status === "Pending" ? "orange" : "red" },
                ]}
              >
                {order.status}
              </Text>
              <Text style={styles.tableCell}>₱{order.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16 },
  header: { backgroundColor: "#89CFF0", paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000",  marginLeft: 10, },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    zIndex: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },

  dropdownBtn: {
    backgroundColor: "#e6f7ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // center text and icon
    },
  dropdownText: { fontSize: 14, fontWeight: "500", color: "#0077b6" , marginRight: 4,},

  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
  menuText: { fontSize: 14, color: "#333" },

  statusRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  exportRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  exportBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  exportText: { color: "#fff", fontWeight: "600" },

  tableBox: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 30 },
  tableTitle: { fontWeight: "600", fontSize: 16, marginBottom: 8, color: "#000" },
  tableHeader: { flexDirection: "row", backgroundColor: "#e6f7ff", borderRadius: 6, marginBottom: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 4, borderRadius: 4 },
  rowEven: { backgroundColor: "#f9f9f9" },
  rowOdd: { backgroundColor: "#fff" },
  tableCell: { flex: 1, fontSize: 13, color: "#333" },
  headerCell: { fontWeight: "700", color: "#0077b6" },
});
