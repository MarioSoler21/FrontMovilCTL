import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/themeContext";

export default function Wishlist() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text, fontSize: 20 }}>Lista de deseos</Text>
    </View>
  );
}
