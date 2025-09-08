import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchConversations } from "@/lib/messages";

// In the future, replace this with your database fetch (e.g., Firebase, Supabase, or SQLite)
const initialMessages = [
  {
    id: 1,
    name: "Jennifer Huh",
    time: "08:26PM",
    lastMessage:
      "Good day! I just wanted to say thank you for your excellent laundry service.",
  },
  {
    id: 2,
    name: "Anna Reyes",
    time: "05:50PM",
    lastMessage: "Thank you for the great service!",
  },
  {
    id: 3,
    name: "Mark Villanueva",
    time: "01:15PM",
    lastMessage: "Appreciate your fast and reliable laundry service.",
  },
  {
    id: 4,
    name: "Mikha Lim",
    time: "27 Mar 2025",
    lastMessage: "Clothes were perfectly cleaned. Thank you!",
  },
  {
    id: 5,
    name: "Kevin Santos",
    time: "7 Mar 2025",
    lastMessage: "Very impressed with your service!",
  },
  {
    id: 6,
    name: "Carla Mendoza",
    time: "15 Feb 2025",
    lastMessage: "Thank you!",
  },
];

export default function MessageScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);

  // Example: This will later be replaced with DB sync
  useEffect(() => {
  setMessages(fetchConversations());
}, []);


  const handleOpenChat = (msg: any) => {
    router.push({
      pathname: "/message/chat", // Navigate to ChatScreen
      params: {
        id: msg.id.toString(),
        name: msg.name,
        lastMessage: msg.lastMessage,
        time: msg.time,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>MESSAGES</Text>
        <View style={styles.rightIcons}>
          <Ionicons
            name="search-outline"
            size={22}
            color="#000"
            style={styles.iconSpacing}
          />
          <Ionicons name="ellipsis-vertical" size={22} color="#000" />
        </View>
      </View>

      {/* Messages List */}
      <ScrollView contentContainerStyle={styles.content}>
        {messages.map((msg) => (
          <TouchableOpacity
            key={msg.id}
            style={styles.card}
            onPress={() => handleOpenChat(msg)}
          >
            <Ionicons name="person-circle-outline" size={40} color="#555" />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{msg.name}</Text>
                <Text style={styles.time}>{msg.time}</Text>
              </View>
              <Text
                style={styles.message}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {msg.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#89CFF0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  iconBtn: {
    paddingRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 12,
  },
  content: {
    padding: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    height: 80,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  message: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
});
