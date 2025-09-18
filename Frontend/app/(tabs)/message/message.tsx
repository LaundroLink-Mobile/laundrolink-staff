import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchConversations } from "@/lib/messages";
import Header from "@/components/Header";

const initialMessages = [
  {
    id: 1,
    name: "Jennifer Huh",
    time: "08:26PM",
    lastMessage:
      "Good day! I just wanted to say thank you for your excellent laundry service.",
    unread: true,
  },
  {
    id: 2,
    name: "Anna Reyes",
    time: "05:50PM",
    lastMessage: "Thank you for the great service!",
    unread: false,
  },
  {
    id: 3,
    name: "Mark Villanueva",
    time: "01:15PM",
    lastMessage: "Appreciate your fast and reliable laundry service.",
    unread: true,
  },
  {
    id: 4,
    name: "Mikha Lim",
    time: "27 Mar 2025",
    lastMessage: "Clothes were perfectly cleaned. Thank you!",
    unread: false,
  },
  {
    id: 5,
    name: "Kevin Santos",
    time: "7 Mar 2025",
    lastMessage: "Very impressed with your service!",
    unread: true,
  },
  {
    id: 6,
    name: "Carla Mendoza",
    time: "15 Feb 2025",
    lastMessage: "Thank you!",
    unread: false,
  },
];

export default function MessageScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);

  // Replace with DB fetch later
  useEffect(() => {
    setMessages(fetchConversations());
  }, []);

  const handleOpenChat = (msg: any) => {
    // ✅ Mark message as read locally
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, unread: false } : m
      )
    );

    // Navigate to chat screen
    router.push({
      pathname: "/message/chat",
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
      <Header
        title="Messages"
        rightActions={
          <>
            <Ionicons
              name="search-outline"
              size={22}
              color="#fff"
              style={{ marginRight: 16 }}
            />
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </>
        }
      />

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
                <View style={styles.rightSection}>
                  <Text style={[styles.time, msg.unread && styles.unreadTime]}>
                    {msg.time}
                  </Text>
                  {msg.unread && <View style={styles.unreadDot} />}
                </View>
              </View>
              <Text
                style={[styles.message, msg.unread && styles.unreadMessage]}
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unreadMessage: {
    fontWeight: "bold",
    color: "#000",
  },
  unreadTime: {
    fontWeight: "bold",
    color: "#000",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1e90ff", // blue dot
  },
});
