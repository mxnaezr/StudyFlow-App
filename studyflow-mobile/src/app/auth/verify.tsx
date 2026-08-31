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

import { router, useLocalSearchParams } from "expo-router";

import Button from "../../components/Button";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../../constants/theme";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const cleanCode = code.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // Check email
    if (!cleanEmail) {
      Alert.alert(
        "Error",
        "Email address is missing. Please register again."
      );
      return;
    }

    // Check verification code
    if (!cleanCode) {
      Alert.alert(
        "Missing code",
        "Please enter the verification code sent to your email."
      );
      return;
    }

    // Code must be exactly 6 digits
    if (!/^\d{6}$/.test(cleanCode)) {
      Alert.alert(
        "Invalid code",
        "Please enter the 6-digit verification code."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Your Spring Boot endpoint:
       *
       * POST /api/auth/verify
       *
       * Parameters:
       * email
       * code
       */

      const url =
        `http://localhost:8080/api/auth/verify` +
        `?email=${encodeURIComponent(cleanEmail)}` +
        `&code=${encodeURIComponent(cleanCode)}`;

      console.log("=================================");
      console.log("VERIFY EMAIL REQUEST");
      console.log("URL:", url);
      console.log("METHOD: POST");
      console.log("EMAIL:", cleanEmail);
      console.log("CODE:", cleanCode);
      console.log("=================================");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("=================================");
      console.log("VERIFY EMAIL RESPONSE");
      console.log("STATUS:", response.status);
      console.log("RESPONSE:", data);
      console.log("=================================");

      if (!response.ok) {
        throw new Error(
          data?.message || "Verification failed."
        );
      }

      // Verification successful
      Alert.alert(
        "Email Verified!",
        "Your email has been verified successfully. You can now log in.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              router.replace("/auth/login");
            },
          },
        ]
      );

    } catch (error: any) {
      console.error(
        "Verification error:",
        error
      );

      Alert.alert(
        "Verification Failed",
        error?.message ||
          "Unable to verify your email. Please try again."
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
          Verify your email
        </Text>

        {/* Description */}
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code
          to your email address.
        </Text>

        {/* Email */}
        <Text style={styles.email}>
          {email}
        </Text>

        <View style={styles.form}>

          {/* Verification Code */}
          <Text style={styles.label}>
            Verification Code
          </Text>

          <TextInput
            style={styles.codeInput}
            placeholder="000000"
            placeholderTextColor={
              COLORS.textMuted
            }
            value={code}
            onChangeText={(text) => {
              // Only allow numbers
              const numbersOnly =
                text.replace(/[^0-9]/g, "");

              // Maximum 6 digits
              setCode(
                numbersOnly.slice(0, 6)
              );
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            textAlign="center"
          />

          {/* Verify Button */}
          <Button
            title="Verify Email"
            onPress={handleVerify}
            loading={loading}
            style={styles.button}
          />

          {/* Information */}
          <Text style={styles.info}>
            The verification code expires
            after 10 minutes.
          </Text>

          {/* Back to Register */}
          <Text
            style={styles.back}
            onPress={() =>
              router.replace(
                "/auth/register"
              )
            }
          >
            ← Back to registration
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
    marginBottom: SPACING.sm,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  email: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },

  codeInput: {
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 8,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },

  button: {
    marginTop: SPACING.xl,
  },

  info: {
    marginTop: SPACING.lg,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  back: {
    textAlign: "center",
    marginTop: SPACING.xl,
    color: COLORS.textMuted,
    fontSize: 14,
  },

});