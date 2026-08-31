import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getCurrentUser,
  getProfileImage,
  logoutUser,
} from "../../services/authService";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../../constants/theme";

export default function ProfileScreen() {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser();
      const image = await getProfileImage();

      if (user) {
        setUserName(user.name || "User");
        setUserEmail(user.email || "");
      }

      setProfileImage(image);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  // Reload profile whenever this screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",

          onPress: async () => {
            try {
              await logoutUser();

              // Replace instead of push so the user
              // cannot return to the profile after logout.
              router.replace("/auth/login");
            } catch (error) {
              console.error("Logout error:", error);

              Alert.alert(
                "Error",
                "Unable to log out. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  const openEditProfile = () => {
    router.push("/edit-profile");
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const openChangePassword = () => {
    router.push("/change-password");
  };

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const openNotifications = () => {
    router.push("/notifications");
  };

  // ============================================================
  // APPEARANCE
  // ============================================================

  const openAppearance = () => {
    router.push("/appearance");
  };

  // ============================================================
  // HELP & SUPPORT
  // ============================================================

  const openHelpSupport = () => {
    router.push("/help-support");
  };

  // ============================================================
  // ABOUT
  // ============================================================

  const openAbout = () => {
    router.push("/about");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <Text style={styles.headerSubtitle}>
          Manage your StudyFlow account
        </Text>
      </View>

      {/* ======================================================
          PROFILE CARD
      ====================================================== */}

      <View style={styles.profileCard}>

        <View style={styles.avatar}>

          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {userName
                ? userName
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </Text>
          )}

        </View>

        <View style={styles.profileInfo}>

          <Text style={styles.name}>
            {userName}
          </Text>

          <Text style={styles.email}>
            {userEmail}
          </Text>

        </View>

      </View>

      {/* ======================================================
          STUDY OVERVIEW
      ====================================================== */}

      <Text style={styles.sectionTitle}>
        Study Overview
      </Text>

      <View style={styles.statsCard}>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            24
          </Text>

          <Text style={styles.statLabel}>
            Sessions
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            18h
          </Text>

          <Text style={styles.statLabel}>
            Study Time
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            5
          </Text>

          <Text style={styles.statLabel}>
            Subjects
          </Text>
        </View>

      </View>

      {/* ======================================================
          ACCOUNT
      ====================================================== */}

      <Text style={styles.sectionTitle}>
        Account
      </Text>

      <View style={styles.menuCard}>

        {/* EDIT PROFILE */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openEditProfile}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              ✎
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              Edit Profile
            </Text>

            <Text style={styles.menuSubtitle}>
              Change your name and profile picture
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* CHANGE PASSWORD */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openChangePassword}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              🔒
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              Change Password
            </Text>

            <Text style={styles.menuSubtitle}>
              Update your account password
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

      </View>

      {/* ======================================================
          PREFERENCES
      ====================================================== */}

      <Text style={styles.sectionTitle}>
        Preferences
      </Text>

      <View style={styles.menuCard}>

        {/* NOTIFICATIONS */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openNotifications}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              🔔
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              Notifications
            </Text>

            <Text style={styles.menuSubtitle}>
              Manage study reminders and notifications
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* APPEARANCE */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openAppearance}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              ◐
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              Appearance
            </Text>

            <Text style={styles.menuSubtitle}>
              Customize how StudyFlow looks
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

      </View>

      {/* ======================================================
          SUPPORT
      ====================================================== */}

      <Text style={styles.sectionTitle}>
        Support
      </Text>

      <View style={styles.menuCard}>

        {/* HELP */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openHelpSupport}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              ?
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              Help & Support
            </Text>

            <Text style={styles.menuSubtitle}>
              Get help with StudyFlow
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* ABOUT */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openAbout}
        >

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              i
            </Text>
          </View>

          <View style={styles.menuTextContainer}>

            <Text style={styles.menuTitle}>
              About StudyFlow
            </Text>

            <Text style={styles.menuSubtitle}>
              Learn more about the app
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

      </View>

      {/* ======================================================
          LOGOUT
      ====================================================== */}

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >

        <Text style={styles.logoutText}>
          Log Out
        </Text>

      </TouchableOpacity>

      {/* ======================================================
          VERSION
      ====================================================== */}

      <Text style={styles.version}>
        StudyFlow v1.0.0
      </Text>

    </ScrollView>
  );
}

// ============================================================
// STYLES
// ============================================================

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
    marginBottom: SPACING.xl,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: 14,
    color: COLORS.textMuted,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  email: {
    marginTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },

  statLabel: {
    marginTop: SPACING.xs,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  divider: {
    width: 1,
    height: 38,
    backgroundColor: COLORS.border,
  },

  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    minHeight: 72,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  icon: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.primary,
  },

  menuTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textMuted,
  },

  arrow: {
    fontSize: 28,
    fontWeight: "300",
    color: COLORS.textMuted,
  },

  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 68,
  },

  logoutButton: {
    height: 52,
    marginTop: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },

  version: {
    marginTop: SPACING.lg,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
  },

});