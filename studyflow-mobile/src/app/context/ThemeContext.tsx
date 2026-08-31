import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    useColorScheme,
} from "react-native";

import {
    COLORS,
    DARK_COLORS,
    LIGHT_COLORS,
    RADIUS,
    SPACING,
} from "../../constants/theme";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  actualTheme: "light" | "dark";
  colors: typeof COLORS;
  setTheme: (theme: ThemeMode) => Promise<void>;
  radius: typeof RADIUS;
  spacing: typeof SPACING;
};

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

const THEME_STORAGE_KEY = "@studyflow_theme";

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemTheme = useColorScheme();

  const [theme, setThemeState] =
    useState<ThemeMode>("system");

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme =
        await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

      if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
      ) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error(
        "Failed to load theme:",
        error
      );
    } finally {
      setLoaded(true);
    }
  };

  const setTheme = async (
    newTheme: ThemeMode
  ) => {
    try {
      setThemeState(newTheme);

      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        newTheme
      );
    } catch (error) {
      console.error(
        "Failed to save theme:",
        error
      );
    }
  };

  const actualTheme =
    theme === "system"
      ? (systemTheme ?? "light")
      : theme;

  const colors =
    actualTheme === "dark"
      ? DARK_COLORS
      : LIGHT_COLORS;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        colors,
        setTheme,
        radius: RADIUS,
        spacing: SPACING,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}