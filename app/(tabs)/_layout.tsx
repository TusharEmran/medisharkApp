import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, View, AppState, AppStateStatus } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { HapticTab } from "@/components/haptic-tab";
import { useTheme } from "../theme/ThemeContext";
import { Colors } from "../../constants/theme";
import SplashScreen from "../splash";

export default function TabLayout() {
  const [showSplashOnResume, setShowSplashOnResume] = useState(false);
  const lastAppState = useRef<AppStateStatus | null>(null);

  useEffect(() => {
    lastAppState.current = AppState.currentState;

    const sub = AppState.addEventListener("change", (next) => {
      if (lastAppState.current === "background" && next === "active") {
        setShowSplashOnResume(true);
      }
      lastAppState.current = next;
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <>
      <ThemedTabs />
      {showSplashOnResume && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen onFinish={() => setShowSplashOnResume(false)} />
        </View>
      )}
    </>
  );
}

function ThemedTabs() {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.iconMuted,

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor:
              Platform.OS === "ios"
                ? isDarkMode
                  ? "rgba(15,23,42,0.9)"
                  : "rgba(255,255,255,0.7)"
                : palette.tabBackground,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Docs */}
      <Tabs.Screen
        name="docs"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_HEIGHT = 64;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,

    height: TAB_HEIGHT,

    backgroundColor: Platform.OS === "ios" ? "rgba(255, 255, 255, 0.7)" : "#FFFFFF",
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 0,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  tabBarItem: {
    height: TAB_HEIGHT,
    paddingBottom: 0,
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});