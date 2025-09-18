// lib/messages.ts

export type ChatMessage = {
  id: number;
  sender: "me" | "other";
  text?: string;
  time: string;
  read?: boolean; // 👈 added this
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
      { id: 1, sender: "other", text: "Hi, do you see a black pants in there?", time: "07:15AM", read: false },
      { id: 2, sender: "me", text: "Good morning, yes. It’s here.", time: "07:16AM", read: true },
    ],
  },
  {
    id: "2",
    name: "Anna Reyes",
    phone: "09171234568",
    messages: [
      { id: 1, sender: "other", text: "Thank you for the great service!", time: "05:50PM", read: false },
    ],
  },
  {
    id: "3",
    name: "Mark Villanueva",
    phone: "09171234569",
    messages: [
      { id: 1, sender: "other", text: "Appreciate your fast and reliable laundry service.", time: "01:15PM", read: false },
    ],
  },
  {
    id: "4",
    name: "Mikha Lim",
    phone: "09171234570",
    messages: [
      { id: 1, sender: "other", text: "Clothes were perfectly cleaned. Thank you!", time: "27 Mar 2025", read: false },
    ],
  },
  {
    id: "5",
    name: "Kevin Santos",
    phone: "09171234571",
    messages: [
      { id: 1, sender: "other", text: "Very impressed with your service!", time: "7 Mar 2025", read: false },
    ],
  },
  {
    id: "6",
    name: "Carla Mendoza",
    phone: "09171234572",
    messages: [
      { id: 1, sender: "other", text: "Thank you!", time: "15 Feb 2025", read: false },
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
      unread: lastMsg?.sender === "other" && lastMsg?.read === false, // 👈 unread if last message is from "other" and not read
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
    read: true, // 👈 sent messages are always "read"
  };
  convo.messages.push(newMsg);
};

// Mark conversation as read
export const markConversationAsRead = (conversationId: string) => {
  const convo = conversations.find((c) => c.id === conversationId);
  if (!convo) return;

  convo.messages = convo.messages.map((m) =>
    m.sender === "other" ? { ...m, read: true } : m
  );
};
