import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  RADIUS,
  SPACING,
} from "../constants/theme";

import { useTheme } from "./context/ThemeContext";

export default function AppearanceScreen() {
  const {
    theme,
    actualTheme,
    colors,
    setTheme,
  } = useTheme();

  const selectTheme = async (
    selectedTheme:
      | "system"
      | "light"
      | "dark"
  ) => {
    await setTheme(selectedTheme);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.backText,
              {
                color: colors.text,
              },
            ]}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View>
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Appearance
          </Text>

          <Text
            style={[
              styles.headerSubtitle,
              {
                color: colors.textMuted,
              },
            ]}
          >
            Customize how StudyFlow looks
          </Text>
        </View>
      </View>

      {/* CURRENT THEME */}

      <View
        style={[
          styles.currentThemeCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.currentThemeLabel,
            {
              color: colors.textMuted,
            },
          ]}
        >
          CURRENT THEME
        </Text>

        <Text
          style={[
            styles.currentTheme,
            {
              color: colors.text,
            },
          ]}
        >
          {actualTheme === "dark"
            ? "Dark Mode"
            : "Light Mode"}
        </Text>
      </View>

      {/* THEME */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Theme
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* SYSTEM */}

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() =>
            selectTheme("system")
          }
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <Text style={styles.icon}>⚙</Text>
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              System Default
            </Text>

            <Text
              style={[
                styles.optionSubtitle,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Follow your device's appearance
            </Text>
          </View>

          <RadioButton
            selected={theme === "system"}
            colors={colors}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        />

        {/* LIGHT */}

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() =>
            selectTheme("light")
          }
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <Text style={styles.icon}>☀</Text>
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Light
            </Text>

            <Text
              style={[
                styles.optionSubtitle,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Use the light appearance
            </Text>
          </View>

          <RadioButton
            selected={theme === "light"}
            colors={colors}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        />

        {/* DARK */}

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() =>
            selectTheme("dark")
          }
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <Text style={styles.icon}>◐</Text>
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Dark
            </Text>

            <Text
              style={[
                styles.optionSubtitle,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Use the dark appearance
            </Text>
          </View>

          <RadioButton
            selected={theme === "dark"}
            colors={colors}
          />
        </TouchableOpacity>
      </View>

      {/* PREVIEW */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Preview
      </Text>

      <View
        style={[
          styles.previewCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.previewTitle,
            {
              color: colors.text,
            },
          ]}
        >
          StudyFlow
        </Text>

        <Text
          style={[
            styles.previewSubtitle,
            {
              color: colors.textMuted,
            },
          ]}
        >
          Your study companion
        </Text>

        <View
          style={[
            styles.previewBox,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.previewBoxTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Today's Progress
          </Text>

          <Text
            style={[
              styles.previewBoxText,
              {
                color: colors.textMuted,
              },
            ]}
          >
            Keep going! You're making progress.
          </Text>
        </View>
      </View>

      {/* INFO */}

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.infoTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Appearance Settings
        </Text>

        <Text
          style={[
            styles.infoText,
            {
              color: colors.textMuted,
            },
          ]}
        >
          Your selected appearance is saved
          automatically and will be remembered
          when you open StudyFlow again.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ============================================================
   RADIO BUTTON
============================================================ */

function RadioButton({
  selected,
  colors,
}: {
  selected: boolean;
  colors: {
    primary: string;
    border: string;
  };
}) {
  return (
    <View
      style={[
        styles.radio,
        {
          borderColor: selected
            ? colors.primary
            : colors.border,
        },
      ]}
    >
      {selected && (
        <View
          style={[
            styles.radioDot,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />
      )}
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  headerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: 13,
  },

  currentThemeCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },

  currentThemeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  currentTheme: {
    marginTop: SPACING.xs,
    fontSize: 20,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    fontSize: 16,
    fontWeight: "800",
  },

  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    minHeight: 78,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 20,
  },

  optionText: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  optionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  divider: {
    height: 1,
    marginLeft: 72,
  },

  previewCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },

  previewTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  previewSubtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  previewBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },

  previewBoxTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  previewBoxText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  infoCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  infoText: {
    marginTop: SPACING.sm,
    fontSize: 13,
    lineHeight: 20,
  },
});