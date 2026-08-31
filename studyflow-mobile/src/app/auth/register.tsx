import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import Button from "../../components/Button";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../../constants/theme";

import { registerUser } from "../../services/authService";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Remove unnecessary spaces
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate fields
    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "The passwords do not match."
      );
      return;
    }

    // Check password length
    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Your password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // Send registration request to Spring Boot
      const response = await registerUser({
        name: cleanName,
        email: cleanEmail,
        password: password,
      });

      console.log("Registration response:", response);

      // Registration successful
      console.log(
        "Registration successful. Opening verification screen..."
      );

      router.push({
        pathname: "/auth/verify",
        params: {
          email: cleanEmail,
        },
      });

    } catch (error: any) {
      console.error("Registration error:", error);

      Alert.alert(
        "Registration Failed",
        error?.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Logo */}
        <Text style={styles.logo}>
          S
        </Text>

        {/* Title */}
        <Text style={styles.title}>
          Create your account
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Start building better study habits
          with StudyFlow.
        </Text>

        <View style={styles.form}>

          {/* Name */}
          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Email */}
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your email"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Confirm Password */}
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={COLORS.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Create Account Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />

          {/* Login Link */}
          <View style={styles.loginRow}>

            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Text
              style={styles.loginLink}
              onPress={() =>
                router.push("/auth/login")
              }
            >
              {" "}Sign in
            </Text>

          </View>

          {/* Back */}
          <Text
            style={styles.back}
            onPress={() => router.back()}
          >
            ← Back
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.xl,
  },

  logo: {
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },

  button: {
    marginTop: SPACING.xl,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },

  loginText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },

  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  back: {
    textAlign: "center",
    marginTop: SPACING.lg,
    color: COLORS.textMuted,
    fontSize: 14,
  },

});