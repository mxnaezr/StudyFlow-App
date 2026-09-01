import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform, useWindowDimensions } from "react-native";

export default function TabsLayout() {
  const { width } = useWindowDimensions();

  // Width of the mobile-style app on web
  const tabBarWidth = Math.min(width - 32, 588);

  // Center the tab bar inside the browser window
  const tabBarLeft = (width - tabBarWidth) / 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#8B8FA3",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 3,
        },

        tabBarStyle: {
          position: "absolute",

          // Mobile-width navigation bar
          width: tabBarWidth,

          // IMPORTANT:
          // Explicitly center the absolute tab bar on web
          ...(Platform.OS === "web"
            ? {
                left: tabBarLeft,
              }
            : {
                left: 0,
                width: "100%",
              }),

          height: 68,

          backgroundColor: "#FFFFFF",

          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",

          borderRadius: 0,

          paddingTop: 7,
          paddingBottom: 7,

          elevation: 8,

          shadowOffset: {
            width: 0,
            height: -2,
          },

          shadowOpacity: 0.08,
          shadowRadius: 8,

          marginBottom: 0,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* SUBJECTS */}
      <Tabs.Screen
        name="subjects"
        options={{
          title: "Subjects",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      {/* FRIENDS */}
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* STATISTICS */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Keep Sessions as a route, but don't show it in the bottom bar */}
      <Tabs.Screen
        name="sessions"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}