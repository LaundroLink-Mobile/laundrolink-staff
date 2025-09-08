import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import LabeledInput from "@/components/ui/LabeledInput";
import Button from "@/components/ui/Button";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // TODO: validate login with API
    router.replace("/home/home");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bubbles-bg.jpg")} // <-- your static image
      style={styles.background}
      resizeMode="cover" // or "contain" / "stretch"
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>LaundroLink</Text>
    
        {/* Email Input */}
        <LabeledInput
          label="Email Address"
          placeholder="Enter email address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <LabeledInput
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <Button title="Log In" onPress={handleLogin} />
      </View>
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
    backgroundColor: "rgba(255,255,255,0.8)", // optional: overlay for readability
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E3A8A", // dark blue
    textAlign: "center",
    marginBottom: 40,
  },
});
