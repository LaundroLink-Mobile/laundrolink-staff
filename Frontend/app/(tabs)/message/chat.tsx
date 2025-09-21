import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import EmojiSelector from "react-native-emoji-selector";
import { useLocalSearchParams } from "expo-router";
import { fetchConversationHistory, sendMessage, markMessagesAsRead, ChatMessage as ApiMessage } from "@/lib/messages";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/Header";

type UIMessage = {
  id: string | number;
  sender: "me" | "other";
  text?: string;
  image?: string;
  time: string;
};

export default function ChatScreen() {
  const { conversationId, partnerName, partnerId } = useLocalSearchParams<{
    conversationId: string;
    partnerName: string;
    partnerId: string;
  }>();
  
  const user = getCurrentUser();
  const userId = user?.UserID;

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (userId && conversationId) {
      setLoading(true);
      await markMessagesAsRead(conversationId, userId);
      const apiHistory: ApiMessage[] = await fetchConversationHistory(conversationId);
      
      const uiMessages: UIMessage[] = apiHistory.map((msg) => ({
        id: msg.id,
        sender: msg.senderId === userId ? "me" : "other",
        text: msg.text,
        image: msg.image,
        time: new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));

      setMessages(uiMessages);
      setLoading(false);
    }
  }, [conversationId, userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSend = async () => {
    if (!input.trim() || !userId || !partnerId) {
      return;
    }
    
    const sentText = input;
    setInput("");
    setShowEmojiPicker(false);

    const newMessage = await sendMessage(userId, partnerId, sentText);

    if (newMessage) {
      await loadHistory();
    } else {
      Alert.alert("Error", "Failed to send message. Please try again.");
      setInput(sentText);
    }
  };

  const pickImage = async () => { /* ... (no changes needed) ... */ };
  const takePhoto = async () => { /* ... (no changes needed) ... */ };

  return (
    <View style={styles.container}>
      <Header title={partnerName as string} rightActions={<Ionicons name="ellipsis-horizontal" size={22} color="#fff" />} />

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#0077b6" />
      ) : (
        <ScrollView style={styles.chatContainer} contentContainerStyle={{ padding: 12 }}>
          {messages.map((msg, index) => (
            <View
              key={`${msg.id}-${index}`}
              style={[
                styles.messageBubble,
                msg.sender === "me" ? styles.myMessage : styles.otherMessage,
              ]}
            >
              {msg.text && <Text style={msg.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>{msg.text}</Text>}
              {msg.image && <Image source={{ uri: msg.image }} style={styles.chatImage} />}
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#0077b6" style={{ marginRight: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="image" size={24} color="#0077b6" style={{ marginRight: 8 }} />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message..." />
              <TouchableOpacity onPress={() => setShowEmojiPicker((prev) => !prev)}>
                <Ionicons name="happy-outline" size={22} color="#0077b6" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {showEmojiPicker && (
            <View style={{ height: 250 }}>
              <EmojiSelector
                onEmojiSelected={(emoji) => setInput((prev) => prev + emoji)}
                showSearchBar={false}
                showTabs={true}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  chatContainer: { flex: 1 },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "75%",
  },
  myMessage: { backgroundColor: "#0077b6", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#e5e5e5", alignSelf: "flex-start" },
  myMessageText: { color: "#fff" },
  otherMessageText: { color: "#000" },
  messageTime: { fontSize: 10, color: "#666", marginTop: 4, textAlign: "right" },
  chatImage: { width: 150, height: 150, borderRadius: 10, marginTop: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  input: { flex: 1, paddingVertical: 8 },
  sendBtn: { backgroundColor: "#0077b6", padding: 10, borderRadius: 50 },
});