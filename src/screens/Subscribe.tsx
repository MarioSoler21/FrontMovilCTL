import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/themeContext";
import { useAuth } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";

type SubscribeParams = {
  Subscribe: {
    planId: "basic" | "pro" | "premium";
    planName: string;
    price: string; // "Gratis" | "L 299" | "L 699"
  };
};

export default function Subscribe() {
  const route = useRoute<RouteProp<SubscribeParams, "Subscribe">>();
  const nav = useNavigation<any>();
  const { planId, planName, price } = route.params;

  const { theme } = useTheme();
  const { user, setPlan } = useAuth();
  const c = theme.colors;

  const styles = useMemo(() => makeStyles(c), [c]);

  // Campos “mock” de pago
  const [fullName, setFullName] = useState("");
  const [card, setCard] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (price !== "Gratis") {
      if (!fullName.trim() || card.replace(/\s/g, "").length < 12 || cvv.length < 3) {
        Alert.alert("Pago", "Completa los datos de pago (simulados).");
        return;
      }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ✅ Guardar plan seleccionado
      setPlan(planId);

      const ref = Math.random().toString(36).slice(2, 8).toUpperCase();
      Alert.alert(
        "¡Suscripción exitosa!",
        `Plan: ${planName}\nPrecio: ${price}\nCorreo: ${user?.email ?? "—"}\nRef: ${ref}`
      );
      nav.goBack();
    }, 1000);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Suscripción</Text>
      <View style={styles.card}>
        <Text style={styles.row}><Text style={styles.label}>Plan:</Text> {planName}</Text>
        <Text style={styles.row}><Text style={styles.label}>Precio:</Text> {price}</Text>
        <Text style={styles.row}><Text style={styles.label}>Correo:</Text> {user?.email ?? "—"}</Text>
      </View>

      {price !== "Gratis" ? (
        <>
          <Text style={styles.labelTop}>Nombre y Apellido</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor={c.placeholder}
          />

          <Text style={styles.labelTop}>Tarjeta (simulada)</Text>
          <TextInput
            value={card}
            onChangeText={setCard}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="4111 1111 1111 1111"
            placeholderTextColor={c.placeholder}
          />

          <Text style={styles.labelTop}>CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={setCvv}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="123"
            placeholderTextColor={c.placeholder}
            maxLength={4}
          />
        </>
      ) : (
        <View style={[styles.card, { marginTop: 8 }]}>
          <Text style={styles.row}>Este plan es gratuito. Solo confirma para activar.</Text>
        </View>
      )}

      <View style={{ height: 12 }} />
      <CustomButton title={loading ? "Procesando…" : "Confirmar suscripción"} onPress={handlePay} />
      {loading ? <View style={{ marginTop: 12 }}><ActivityIndicator /></View> : null}
    </View>
  );
}

type Colors = {
  background: string; card: string; text: string; subtitle: string; primary: string;
  border: string; inputBg: string; inputText: string; placeholder: string; buttonText: string;
};

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background, padding: 16 },
    title: { color: c.text, fontSize: 20, fontWeight: "800", marginBottom: 12, textAlign: "center" },
    card: { backgroundColor: c.card, borderRadius: 12, borderWidth: 1, borderColor: c.border, padding: 12 },
    row: { color: c.text, marginBottom: 6 },
    label: { color: c.subtitle, fontWeight: "700" },
    labelTop: { color: c.text, marginTop: 12, marginBottom: 6, fontWeight: "700" },
    input: {
      backgroundColor: c.inputBg,
      color: c.inputText,
      borderWidth: 1, borderColor: c.border,
      borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    },
  });
