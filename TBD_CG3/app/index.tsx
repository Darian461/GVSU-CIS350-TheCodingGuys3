import 'react-native-url-polyfill/auto';
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// FastAPI host IP 
const API_BASE = "http://localhost:8000";


type AuthMode = "login" | "register";

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<any>();

  const handleAuth = async () => {
    try {
      const endpoint =
        mode === "login"
          ? `${API_BASE}/login`
          : `${API_BASE}/register`;

      // match FastAPI’s expected request body
      const payload =
        mode === "login"
          ? { identifier: email, password }
          : { username, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        alert(`❌ ${data.detail || "Something went wrong"}`);
        return;
      }

      if (mode === "register") {
        alert("✅ Account created successfully!");
      } else {
        alert("✅ Logged in successfully!");
        navigation.replace("Home");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("⚠️ Network or server error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </Text>

        {mode === "register" && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={mode === "login" ? "Email or Username" : "Email"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === "login" ? "register" : "login")}
        >
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Don’t have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 400, backgroundColor: "#FFF", padding: 24, borderRadius: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#6366F1", borderRadius: 12, paddingVertical: 14 },
  buttonText: { color: "#FFF", fontWeight: "600", textAlign: "center" },
  toggleText: { textAlign: "center", color: "#666", marginTop: 16 },
});
