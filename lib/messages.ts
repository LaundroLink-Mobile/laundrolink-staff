// lib/messages.ts

export type ChatMessage = {
  id: number;
  sender: "me" | "other";
  text?: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  phone: string;
  messages: ChatMessage[];
};

let conversations: Conversation[] = [
  {
    id: "1",
    name: "Jennifer Huh",
    phone: "09171234567",
    messages: [
      { id: 1, sender: "other", text: "Hi, do you see a black pants in there?", time: "07:15AM" },
      { id: 2, sender: "me", text: "Good morning, yes. It’s here.", time: "07:16AM" },
    ],
  },
];

// Fetch all conversations with preview
export const fetchConversations = () => {
  return conversations.map((c) => {
    const lastMsg = c.messages[c.messages.length - 1];
    return {
      id: Number(c.id),
      name: c.name,
      time: lastMsg?.time || "",
      lastMessage: lastMsg?.text || "",
    };
  });
};

// Add a new message
export const sendMessageToCustomer = async (
  conversationId: string,
  text: string
) => {
  const convo = conversations.find((c) => c.id === conversationId);
  if (!convo) return;

  const newMsg: ChatMessage = {
    id: convo.messages.length + 1,
    sender: "me",
    text,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  convo.messages.push(newMsg);
};
