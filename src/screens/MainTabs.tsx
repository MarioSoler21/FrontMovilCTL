// src/screens/MainTabs.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TabBar } from "../components/TabBar";
import Home from "./Home";
import { useTheme } from "../contexts/themeContext";
import { useRoute, RouteProp } from "@react-navigation/native";

import Featured from "./Featured";
import Search from "./Search";
import Wishlist from "./Wishlist";
import Account from "./Account";

type TabKey = "featured" | "search" | "learning" | "wishlist" | "account";
type MainRouteParams = { MainScreen?: { initialTab?: TabKey; correo?: string } };

const isValidTab = (v: any): v is TabKey =>
  v === "featured" || v === "search" || v === "learning" || v === "wishlist" || v === "account";

export default function MainTabs() {
  const { theme, setMode } = useTheme();
  const route = useRoute<RouteProp<MainRouteParams, "MainScreen">>();
  const [tab, setTab] = useState<TabKey>("learning");

  useEffect(() => {
    const candidate = route.params?.initialTab;
    if (candidate && isValidTab(candidate)) setTab(candidate);
  }, [route.params?.initialTab]);

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const toggleTheme = () => setMode(theme.isDark ? "light" : "dark");

  const renderScreen = () => {
    switch (tab) {
      case "featured": return <Featured />;
      case "search":   return <Search />;
      case "learning": return <Home />;
      case "wishlist": return <Wishlist />;
      case "account":  return <Account />; // aquí está el switch de tema
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
        themeSwitch={{ isDark: theme.isDark, onToggle: toggleTheme }} // si quieres también desde la barra
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
