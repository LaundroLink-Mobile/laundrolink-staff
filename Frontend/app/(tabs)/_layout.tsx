import { Tabs, useLocalSearchParams } from "expo-router"; // ✅ Import useLocalSearchParams
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const { shopId, userId } = useLocalSearchParams(); // ✅ Get params passed from login

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0077b6",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        // ✅ Pass params to home screen
        initialParams={{ shopId, userId }} 
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        // ✅ Pass params to order screen
        initialParams={{ shopId, userId }} 
        options={{
          title: "Order",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        // ✅ Pass params to message screen
        initialParams={{ shopId, userId }}
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}