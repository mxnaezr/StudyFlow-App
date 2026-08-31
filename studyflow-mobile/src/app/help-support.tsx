import { router } from "expo-router";
import React from "react";

import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../constants/theme";

export default function HelpSupportScreen() {

  const openEmail = async () => {
    try {
      await Linking.openURL(
        "mailto:support@studyflow.com"
      );
    } catch {
      Alert.alert(
        "Unable to open email",
        "Please contact StudyFlow support manually."
      );
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/tabs/profile");
            }
          }}
        >
          <Text style={styles.back}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Help & Support
        </Text>

        <View style={{ width: 30 }} />

      </View>

      <View style={styles.card}>

        <Text style={styles.heading}>
          How can we help?
        </Text>

        <Text style={styles.description}>
          If you are having problems using StudyFlow,
          you can contact our support team.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={openEmail}
        >
          <Text style={styles.buttonText}>
            Contact Support
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.card}>

        <Text style={styles.heading}>
          Common Questions
        </Text>

        <Text style={styles.question}>
          How do I edit my profile?
        </Text>

        <Text style={styles.answer}>
          Open Profile → Edit Profile and update
          your information.
        </Text>

        <Text style={styles.question}>
          How do I change my password?
        </Text>

        <Text style={styles.answer}>
          Open Profile → Change Password.
        </Text>

        <Text style={styles.question}>
          How do I change the appearance?
        </Text>

        <Text style={styles.answer}>
          Open Profile → Appearance and select
          your preferred theme.
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },

  back: {
    fontSize: 36,
    color: COLORS.primary,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textMuted,
  },

  button: {
    height: 50,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  question: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.md,
  },

  answer: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
    marginTop: 4,
  },

});