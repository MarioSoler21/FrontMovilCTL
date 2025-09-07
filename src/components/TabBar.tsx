
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type TabKey = "featured" | "search" | "learning" | "wishlist" | "account";
type Tab = { key: TabKey; label: string; icon: string };

const TABS: Tab[] = [
  { key: "featured", label: "Destacados",     icon: "star-outline" },
  { key: "search",   label: "Buscar",         icon: "search" },
  { key: "learning", label: "Mi aprendizaje", icon: "play-circle-outline" },
  { key: "wishlist", label: "Lista de deseos",icon: "favorite-border" },
  { key: "account",  label: "Cuenta",         icon: "person-outline" },
];

export function TabBar({
  active,
  onChange,
  backgroundColor = "#0B1026",
  borderColor = "rgba(147,197,253,0.25)",
  activeColor = "#ffffff",
  inactiveColor = "#93C5FD",
  themeSwitch,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  backgroundColor?: string;
  borderColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  themeSwitch?: { isDark: boolean; onToggle: () => void }; 
}) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <View style={[styles.wrap, { backgroundColor, borderTopColor: borderColor }]}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          const isCenter = tab.key === "learning";
          const iconSize = isCenter ? 34 : 26;
          const color = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.item, isCenter && styles.center]}
              onPress={() => onChange(tab.key)}
              activeOpacity={0.7}
            >
              <Icon name={tab.icon} size={iconSize} color={color} style={isCenter && { marginBottom: 2 }} />
              <Text style={[styles.label, { color }, isCenter && styles.centerLabel]} numberOfLines={1}>
                {tab.label}
              </Text>

              {tab.key === "account" && themeSwitch && (
                <View style={{ marginTop: 4 }}>
                  <Switch
                    value={themeSwitch.isDark}
                    onValueChange={themeSwitch.onToggle}
                    trackColor={{ false: borderColor, true: activeColor }}
                    thumbColor={themeSwitch.isDark ? activeColor : inactiveColor}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {},
  wrap: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 6,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 11, fontWeight: "600" },
  center: { transform: [{ translateY: -6 }] },
  centerLabel: { fontWeight: "800" },
});
