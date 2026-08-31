import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../constants/theme";

const NOTIFICATIONS_KEY =
  "studyflow_notifications_enabled";

const REMINDERS_KEY =
  "studyflow_study_reminders_enabled";

export default function NotificationsScreen() {

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [studyRemindersEnabled, setStudyRemindersEnabled] =
    useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications =
        await AsyncStorage.getItem(
          NOTIFICATIONS_KEY
        );

      const reminders =
        await AsyncStorage.getItem(
          REMINDERS_KEY
        );

      if (notifications !== null) {
        setNotificationsEnabled(
          notifications === "true"
        );
      }

      if (reminders !== null) {
        setStudyRemindersEnabled(
          reminders === "true"
        );
      }

    } catch (error) {
      console.error(
        "Failed to load notification settings:",
        error
      );
    }
  };

  const toggleNotifications = async (
    value: boolean
  ) => {
    setNotificationsEnabled(value);

    await AsyncStorage.setItem(
      NOTIFICATIONS_KEY,
      String(value)
    );

    if (!value) {
      setStudyRemindersEnabled(false);

      await AsyncStorage.setItem(
        REMINDERS_KEY,
        "false"
      );
    }
  };

  const toggleReminders = async (
    value: boolean
  ) => {
    setStudyRemindersEnabled(value);

    await AsyncStorage.setItem(
      REMINDERS_KEY,
      String(value)
    );
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
          Notifications
        </Text>

        <View style={{ width: 30 }} />

      </View>

      <View style={styles.card}>

        <View style={styles.row}>

          <View style={styles.textContainer}>

            <Text style={styles.rowTitle}>
              Notifications
            </Text>

            <Text style={styles.rowSubtitle}>
              Enable StudyFlow notifications
            </Text>

          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{
              false: COLORS.border,
              true: COLORS.primary,
            }}
          />

        </View>

        <View style={styles.divider} />

        <View style={styles.row}>

          <View style={styles.textContainer}>

            <Text style={styles.rowTitle}>
              Study Reminders
            </Text>

            <Text style={styles.rowSubtitle}>
              Receive reminders about your study sessions
            </Text>

          </View>

          <Switch
            value={studyRemindersEnabled}
            onValueChange={toggleReminders}
            disabled={!notificationsEnabled}
            trackColor={{
              false: COLORS.border,
              true: COLORS.primary,
            }}
          />

        </View>

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
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
  },

  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  rowSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
  },

});