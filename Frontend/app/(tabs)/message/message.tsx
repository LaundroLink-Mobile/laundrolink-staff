import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchConversations, ConversationPreview } from "@/lib/messages";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/Header";

export default function MessageScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();
  const userId = user?.UserID;

  useFocusEffect(
    useCallback(() => {
      const loadConversations = async () => {
        if (userId) {
          setLoading(true);
          const data = await fetchConversations(userId);
          setConversations(data);
          setLoading(false);
        }
      };
      loadConversations();
    }, [userId])
  );

  const handleOpenChat = (convo: ConversationPreview) => {
    // ✅ Pass the conversationId to the chat screen for a faster lookup
    router.push({
      pathname: "/message/chat",
      params: {
        conversationId: convo.conversationId,
        partnerName: convo.name,
        partnerId: convo.partnerId, // Keep this for reference if needed
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Messages" />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {conversations.map((convo) => (
            // ✅ Use conversationId as the key
            <TouchableOpacity key={convo.conversationId} style={styles.card} onPress={() => handleOpenChat(convo)}>
              <Ionicons name="person-circle-outline" size={40} color="#555" />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{convo.name}</Text>
                  <View style={styles.rightSection}>
                    <Text style={[styles.time, convo.unreadCount > 0 && styles.unreadTime]}>
                      {new Date(convo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {convo.unreadCount > 0 && <View style={styles.unreadDot} />}
                  </View>
                </View>
                <Text style={[styles.message, convo.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
                  {convo.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
    alignItems: "center",
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
    backgroundColor: "#1e90ff",
  },
});
