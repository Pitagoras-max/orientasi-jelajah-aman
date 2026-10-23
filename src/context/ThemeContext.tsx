// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  card: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryLight: string;
  danger: string;
  dangerLight: string;
  tabBar: string;
  tabBarBorder: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  statusBasiBg: string;
  statusBasiText: string;
  statusSegarBg: string;
  statusSegarText: string;
}

export const lightColors: ThemeColors = {
  background: "#F8F9FA",
  backgroundElement: "#F0F0F3",
  backgroundSelected: "#E0E1E6",
  card: "#FFFFFF",
  cardSecondary: "#F1F5F9",
  text: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E2E8F0",
  inputBackground: "#F1F5F9",
  inputText: "#1E293B",
  inputPlaceholder: "#94A3B8",
  statusBasiBg: "#FEF3C7",
  statusBasiText: "#92400E",
  statusSegarBg: "#D1FAE5",
  statusSegarText: "#065F46",
};

export const darkColors: ThemeColors = {
  background: "#0F172A",
  backgroundElement: "#212225",
  backgroundSelected: "#2E3135",
  card: "#1E293B",
  cardSecondary: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  primary: "#3B82F6",
  primaryLight: "#1E3A8A",
  danger: "#EF4444",
  dangerLight: "#7F1D1D",
  tabBar: "#1E293B",
  tabBarBorder: "#334155",
  inputBackground: "#334155",
  inputText: "#F8FAFC",
  inputPlaceholder: "#64748B",
  statusBasiBg: "#78350F",
  statusBasiText: "#FDE68A",
  statusSegarBg: "#064E3B",
  statusSegarText: "#A7F3D0",
};


interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
  theme: ThemeColors;
  effectiveTheme: "light" | "dark";
}

const STORAGE_KEY = "@jelajah-aman:theme_mode";

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  setThemeMode: async () => {},
  isDark: false,
  theme: lightColors,
  effectiveTheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const deviceColorScheme = useDeviceColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemeModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const effectiveTheme: "light" | "dark" = useMemo(() => {
    if (themeMode === "system") {
      return deviceColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, deviceColorScheme]);

  const isDark = effectiveTheme === "dark";
  const theme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        isDark,
        theme,
        effectiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
