import React from "react";
import { TouchableOpacity, Image, StyleSheet, Linking, ViewStyle } from "react-native";

type Props = {
  phone: string;            // ej: "50499998888"
  text?: string;            // mensaje prellenado
  style?: ViewStyle;
};

export default function FloatingWhatsapp({ phone, text, style }: Props) {
  const open = () => {
    const msg = encodeURIComponent(text || "Hola, tengo una consulta.");
    const url = `https://wa.me/${phone}?text=${msg}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity onPress={open} activeOpacity={0.8} style={[styles.fab, style]}>
      <Image
        // puedes cambiarlo a require("../Img/whatsapp.png") si tienes el asset local
        source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" }}
        style={{ width: 28, height: 28 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
