import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
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

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            About StudyFlow
          </Text>

          <Text style={styles.headerSubtitle}>
            Learn more about the app
          </Text>
        </View>
      </View>

      {/* APP INFO */}
      <View style={styles.appCard}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.appName}>
          StudyFlow
        </Text>

        <Text style={styles.version}>
          Version 1.0.0
        </Text>

        <Text style={styles.description}>
          StudyFlow is a student-focused study management
          application designed to help students build better
          study habits, organize their subjects, track study
          sessions, and monitor their academic progress.
        </Text>
      </View>

      {/* FEATURES */}
      <Text style={styles.sectionTitle}>
        What StudyFlow Does
      </Text>

      <View style={styles.card}>
        <View style={styles.feature}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📚</Text>
          </View>

          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>
              Manage Subjects
            </Text>

            <Text style={styles.featureDescription}>
              Organize your subjects and keep your study
              materials and goals structured.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.feature}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⏱</Text>
          </View>

          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>
              Track Study Sessions
            </Text>

            <Text style={styles.featureDescription}>
              Record your study sessions and keep track of
              the time you spend learning.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.feature}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📊</Text>
          </View>

          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>
              Monitor Progress
            </Text>

            <Text style={styles.featureDescription}>
              View your study activity and understand your
              progress over time.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.feature}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🤖</Text>
          </View>

          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>
              AI Study Assistance
            </Text>

            <Text style={styles.featureDescription}>
              Get help with studying through StudyFlow's
              AI-powered features.
            </Text>
          </View>
        </View>
      </View>

      {/* PURPOSE */}
      <Text style={styles.sectionTitle}>
        Our Purpose
      </Text>

      <View style={styles.card}>
        <Text style={styles.bodyText}>
          StudyFlow was created to make studying easier to
          organize and more consistent. The app brings
          planning, study sessions, progress tracking, and
          study assistance together in one place.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          StudyFlow
        </Text>

        <Text style={styles.footerSubtext}>
          Build better study habits.
        </Text>

        <Text style={styles.copyright}>
          © 2026 StudyFlow
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  backText: {
    fontSize: 32,
    color: COLORS.text,
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  appCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: "center",
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },

  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  version: {
    marginTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  description: {
    marginTop: SPACING.lg,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: COLORS.textMuted,
  },

  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 20,
  },

  featureText: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  featureDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 56,
  },

  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textMuted,
  },

  footer: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },

  footerText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  footerSubtext: {
    marginTop: SPACING.xs,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  copyright: {
    marginTop: SPACING.md,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});