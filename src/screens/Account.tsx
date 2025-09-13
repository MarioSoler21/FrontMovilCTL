import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../contexts/themeContext";

export default function Account() {
  const { theme, setMode } = useTheme();
  const toggle = () => setMode(theme.isDark ? "light" : "dark");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text, fontSize: 20 }}>Cuenta</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ color: theme.colors.text }}>Dark mode</Text>
        <Switch value={theme.isDark} onValueChange={toggle} />
      </View>
    </View>
  );
}
