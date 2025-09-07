import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "auto" | "light" | "dark";

type Theme = {
  mode: ThemeMode;          // preferencia del usuario
  isDark: boolean;          // útil para condicionales simples
  colors: {
    background: string;
    card: string;
    text: string;
    subtitle: string;
    primary: string;
    border: string;
    inputBg: string;
    inputText: string;
    placeholder: string;
    buttonText: string;
  };
};

type ThemeContextType = {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleDarkLight: () => void; // alterna entre light/dark si no quieres auto
};

const THEME_KEY = "@theme_mode";

const ThemeContext = createContext<ThemeContextType | null>(null);

function buildColors(isDark: boolean) {
  if (isDark) {
    return {
      background: "#0f172a",  // slate-900
      card: "#111827",        // gray-900
      text: "#F8FAFC",        // slate-50
      subtitle: "#CBD5E1",    // slate-300
      primary: "#3B82F6",     // blue-500
      border: "#1f2937",      // gray-800
      inputBg: "#1f2937",
      inputText: "#F8FAFC",
      placeholder: "#9CA3AF",
      buttonText: "#FFFFFF",
    };
  }
  return {
    background: "#FFFFFF",
    card: "#F3F4F6",          // gray-100
    text: "#111827",          // gray-900
    subtitle: "#4B5563",      // gray-600
    primary: "#2563EB",       // blue-600
    border: "#E5E7EB",        // gray-200
    inputBg: "#FFFFFF",
    inputText: "#111827",
    placeholder: "#6B7280",
    buttonText: "#FFFFFF",
  };
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [mode, setModeState] = useState<ThemeMode>("auto");

  // Cargar tema almacenado
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark" || saved === "auto") {
          setModeState(saved);
          console.log("[Theme] Cargado de AsyncStorage:", saved);
        } else {
          console.log("[Theme] Sin preferencia guardada, usando 'auto'");
        }
      } catch (e) {
        console.log("[Theme] Error cargando preferencia:", e);
      }
    })();
  }, []);

  // Escuchar cambios del sistema cuando esté en modo "auto"
  useEffect(() => {
    if (mode !== "auto") return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      console.log("[Theme] Cambio de sistema detectado:", colorScheme);
    });
    return () => sub.remove();
  }, [mode]);

  const isDark = useMemo<boolean>(() => {
    if (mode === "light") return false;
    if (mode === "dark") return true;
    // "auto": seguir el sistema
    return (systemScheme as ColorSchemeName) === "dark";
  }, [mode, systemScheme]);

  const colors = useMemo(() => buildColors(isDark), [isDark]);

  const setMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
      setModeState(newMode);
      console.log("[Theme] Guardado en AsyncStorage:", newMode);
    } catch (e) {
      console.log("[Theme] Error guardando preferencia:", e);
    }
  };

  const toggleDarkLight = () => setMode(isDark ? "light" : "dark");

  const value = useMemo<ThemeContextType>(() => ({
    theme: { mode, isDark, colors },
    setMode,
    toggleDarkLight,
  }), [mode, isDark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
};
