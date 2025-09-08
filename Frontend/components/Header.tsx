import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backgroundColor?: string; // customizable per page
  rightActions?: React.ReactNode; // optional right-side actions
}

export default function Header({
  title,
  showBack = true,
  backgroundColor = "#00aaff", // default theme color
  rightActions,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>

      {/* Right side actions (for pages like Messages) */}
      {rightActions && <View style={styles.rightActions}>{rightActions}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingTop: 30, // spacing from top
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
