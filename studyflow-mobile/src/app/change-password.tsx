import { router } from "expo-router";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { apiRequest } from "../services/api";
import {
  COLORS,
  RADIUS,
  SPACING,
} from "../constants/theme";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const changePassword = async () => {
    if (saving) {
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        "Required",
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      Alert.alert(
        "Required",
        "Please enter your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Your new password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure your new passwords match."
      );
      return;
    }

    try {
      setSaving(true);

      await apiRequest(
        "/api/auth/change-password",
        {
          method: "PUT",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      console.error(
        "Change password error:",
        error
      );

      Alert.alert(
        "Unable to change password",
        error?.message ||
          "Please check your current password and try again."
      );

    } finally {
      setSaving(false);
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
          Change Password
        </Text>

        <View style={{ width: 30 }} />

      </View>

      <View style={styles.form}>

        <Text style={styles.label}>
          Current Password
        </Text>

        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>
          New Password
        </Text>

        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>
          Confirm New Password
        </Text>

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.button,
            saving && styles.disabled,
          ]}
          onPress={changePassword}
          disabled={saving}
        >

          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.buttonText}>
              Change Password
            </Text>
          )}

        </TouchableOpacity>

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

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  button: {
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

});