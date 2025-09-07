// src/screens/MainTabs.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TabBar } from "../components/TabBar";
import Home from "./Home";
import { useTheme } from "../contexts/themeContext";
import { useRoute, RouteProp } from "@react-navigation/native";

type TabKey = "featured" | "search" | "learning" | "wishlist" | "account";
type MainRouteParams = { MainScreen?: { initialTab?: TabKey; correo?: string } };

const isValidTab = (v: any): v is TabKey =>
  v === "featured" || v === "search" || v === "learning" || v === "wishlist" || v === "account";

const Placeholder = ({ label, color }: { label: string; color: string }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ color, fontSize: 18 }}>{label}</Text>
  </View>
);

export default function MainTabs() {
  const { theme, setMode } = useTheme();
  const route = useRoute<RouteProp<MainRouteParams, "MainScreen">>();
  const [tab, setTab] = useState<TabKey>("learning");

  useEffect(() => {
    const candidate = route.params?.initialTab;
    if (candidate && isValidTab(candidate)) setTab(candidate);
  }, [route.params?.initialTab]);

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  // <-- NUEVO: alterna solo entre light/dark
  const toggleTheme = () => setMode(theme.isDark ? "light" : "dark");

  const renderScreen = () => {
    switch (tab) {
      case "featured": return <Placeholder label="Destacados" color={theme.colors.text} />;
      case "search":   return <Placeholder label="Buscar" color={theme.colors.text} />;
      case "learning": return <Home />;
      case "wishlist": return <Placeholder label="Lista de deseos" color={theme.colors.text} />;
      case "account":  return <Placeholder label="Cuenta" color={theme.colors.text} />;
      default:         return null;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderScreen()}</View>
      <TabBar
        active={tab}
        onChange={setTab}
        backgroundColor={theme.colors.card}
        borderColor={theme.colors.border}
        activeColor={theme.colors.text}
        inactiveColor={theme.colors.subtitle}
        // <-- NUEVO: props para el switch
        themeSwitch={{ isDark: theme.isDark, onToggle: toggleTheme }}
      />
    </View>
  );
}

type Colors = {
  background: string; card: string; text: string; subtitle: string; primary: string;
  border: string; inputBg: string; inputText: string; placeholder: string; buttonText: string;
};
const makeStyles = (c: Colors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  content: { flex: 1 },
});
