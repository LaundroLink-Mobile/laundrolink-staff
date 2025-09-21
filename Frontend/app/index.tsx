import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { useRouter } from "expo-router";
import LabeledInput from "@/components/ui/LabeledInput";
import Button from "@/components/ui/Button";
import { login } from "@/lib/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Alert.alert("Success", "Login successful!");
        
        // ✅ Save the user data globally
        await login(data.user);

        // ✅ Navigate without passing any parameters
        router.replace("/home/home"); 

      } else {
        Alert.alert("Login Failed", data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Unable to connect to server.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bubbles-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>LaundroLink</Text>

        <LabeledInput
          label="Email Address"
          placeholder="Enter email address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <LabeledInput
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Log In" onPress={handleLogin} />
      </View> 
      {/* ✅ FIX: Added the missing '>' to the closing View tag */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 40,
  },
});