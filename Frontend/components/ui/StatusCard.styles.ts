import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
});

export default styles;
