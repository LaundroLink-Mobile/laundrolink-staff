import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./StatusCard.styles";

type StatusCardProps = {
  label: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
};

export default function StatusCard({ label, count, icon, color }: StatusCardProps) {
  return (
    <View style={styles.statusCard}>
      <Ionicons name={icon} size={28} color={color || "#333"} style={{ marginBottom: 6 }} />
      <Text style={styles.statusCount}>{count}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}
