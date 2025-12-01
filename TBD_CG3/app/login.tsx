import { API_BASE_URL } from "@/app/config/apiConfig";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-url-polyfill/auto";
import { storeToken } from "./services/tokenService";

const API_BASE = API_BASE_URL;

type AuthMode = "login" | "register";

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<any>();

  const handleAuth = async () => {
    if (mode === "register" && !username.trim()) {
      alert("Please enter a username.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email or username.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {
      const endpoint =
        mode === "login" ? `${API_BASE}/login` : `${API_BASE}/register`;

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

      if (!response.ok) {
        alert(data.detail || "Something went wrong.");
        return;
      }

      if (mode === "register") {
        alert("Account created successfully. Please log in.");
        setMode("login");
        setPassword("");
      } else {
        if (data.access_token) {
          await storeToken(data.access_token);
          navigation.replace("(tabs)");
        } else {
          alert("Login successful but no token received.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Network or server error.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* LOGO */}
        <Image
          source={require("../assets/images/macal_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appTitle}>macal</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Login to your account" : "Create a new account"}
        </Text>

        {mode === "register" && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={mode === "login" ? "Email or Username" : "Email"}
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
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
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    width: "100%",
    paddingVertical: 16,
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  toggleText: {
    marginTop: 20,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 14,
  },
});
