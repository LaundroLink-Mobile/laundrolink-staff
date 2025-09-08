import { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import EmojiSelector from "react-native-emoji-selector";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchConversations, sendMessageToCustomer } from "@/lib/messages";

type Message = {
  id: number;
  sender: "me" | "other";
  text?: string;
  image?: string;
  time: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const convos = fetchConversations();
    const convo = convos.find((c) => c.id === id);
    setMessages(convo ? convo.messages : []);
    }, [id]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessageToCustomer(id as string, input);
    setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "me", text: input, time: "Now" },
    ]);
    setInput("");
    };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "me",
        image: result.assets[0].uri,
        time: "Now",
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "me",
        image: result.assets[0].uri,
        time: "Now",
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="person-circle-outline" size={32} color="#000" />
          <Text style={styles.headerText}>{name}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
      </View>

      {/* Chat messages */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ padding: 12 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {msg.text && <Text style={styles.messageText}>{msg.text}</Text>}
            {msg.image && <Image source={{ uri: msg.image }} style={styles.chatImage} />}
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input bar */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View>
          <View style={styles.inputContainer}>
            {/* Camera */}
            <TouchableOpacity onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#0077b6" style={{ marginRight: 8 }} />
            </TouchableOpacity>

            {/* Gallery */}
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="image" size={24} color="#0077b6" style={{ marginRight: 8 }} />
            </TouchableOpacity>

            {/* Text field with emoji icon inside */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
              />
              <TouchableOpacity onPress={() => setShowEmojiPicker((prev) => !prev)}>
                <Ionicons name="happy-outline" size={22} color="#0077b6" />
              </TouchableOpacity>
            </View>

            {/* Send */}
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Emoji picker below input */}
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
  header: {
    backgroundColor: "#89CFF0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  chatContainer: { flex: 1 },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "75%",
  },
  myMessage: { backgroundColor: "#0077b6", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#e5e5e5", alignSelf: "flex-start" },
  messageText: { color: "#000" },
  messageTime: { fontSize: 10, color: "#444", marginTop: 4, textAlign: "right" },
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
