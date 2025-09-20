// src/screens/Account.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../contexts/themeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

type Colors = {
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

export default function Account() {
  const { theme, setMode } = useTheme();
  const { user, plan, isBasic, isPro, isPremium, signOut } = useAuth() as any;
  const nav = useNavigation<any>();

  const styles = useMemo(() => makeStyles(theme.colors as Colors), [theme.colors]);
  const toggleTheme = () => setMode(theme.isDark ? "light" : "dark");

  const email = (user && (user.email || user.name)) || "usuario@correo.com";
  const initials = email?.[0]?.toUpperCase() || "U";

  const planLabel = isPremium ? "Premium" : isPro ? "Pro" : "Básico";
  const canUpgrade = !isPremium;

  return (
    <View style={styles.root}>
      {/* HEADER PERFIL */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{initials}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {email.split("@")[0]}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>

          <View style={[styles.badgePlan, badgeColors(planLabel, theme.colors as Colors)]}>
            <Text style={styles.badgePlanTxt}>Plan {planLabel}</Text>
          </View>
        </View>
      </View>

      {/* CONTROLES RÁPIDOS */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardTight]}>
          <Text style={styles.cardTitle}>Apariencia</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Modo oscuro</Text>
            <Switch value={theme.isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <View style={[styles.card, styles.cardTight]}>
          <Text style={styles.cardTitle}>Tu plan</Text>
          <Text style={styles.helper}>Disfruta de los cursos incluidos en tu suscripción.</Text>

          {canUpgrade ? (
            <View style={{ marginTop: 8 }}>
              <CustomButton
                title={isPro ? "Mejorar a Premium" : "Mejorar a Pro"}
                onPress={() =>
                  nav.navigate("Subscribe", {
                    planId: isPro ? "premium" : "pro",
                    planName: isPro ? "Premium" : "Pro",
                    price: isPro ? "L 699" : "L 299",
                  })
                }
              />
            </View>
          ) : (
            <View style={[styles.pillOk]}>
              <Text style={styles.pillOkTxt}>Al día </Text>
            </View>
          )}
        </View>
      </View>

      {/* ACCESOS / AJUSTES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferencias</Text>

        <Item
          label="Editar perfil"
          hint="Nombre y contacto"
          onPress={() => {}}
        />
        <Separator />
        <Item
          label="Suscripción"
          hint={`Plan actual: ${planLabel}`}
          onPress={() =>
            nav.navigate("Subscribe", {
              planId: isPremium ? "premium" : isPro ? "pro" : "basic",
              planName: planLabel,
              price: isPremium ? "L 699" : isPro ? "L 299" : "Gratis",
            })
          }
        />
        <Separator />
        <Item label="Métodos de pago" hint="Administra tus pagos" onPress={() => {}} />
        <Separator />
        <Item label="Historial de cursos" hint="Tu progreso y vistos" onPress={() => {}} />
      </View>

      {/* AYUDA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Soporte</Text>
        <Item label="Centro de ayuda" hint="Preguntas frecuentes" onPress={() => {}} />
        <Separator />
        <Item label="Escríbenos por WhatsApp" hint="Atención en horario laboral" onPress={() => {}} />
      </View>

      {/* SALIR */}
      <TouchableOpacity
        onPress={() => (typeof signOut === "function" ? signOut() : null)}
        style={[styles.logoutBtn]}
      >
        <Text style={styles.logoutTxt}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Componentes internos ---------- */

function Item({
  label,
  hint,
  onPress,
}: {
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 12 }}>
      <Text style={{ fontWeight: "700", fontSize: 15, color: "#fff" }}>{label}</Text>
      {hint ? <Text style={{ color: "#9BA1A6", marginTop: 2 }}>{hint}</Text> : null}
    </TouchableOpacity>
  );
}

function Separator() {
  return <View style={{ height: 1, backgroundColor: "#2a2f36", marginVertical: 6 }} />;
}

/* ---------- Estilos ---------- */

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background, padding: 16, gap: 12 },

    header: {
      flexDirection: "row",
      gap: 14,
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
      alignItems: "center",
    },

    avatarWrap: { width: 64, height: 64, borderRadius: 32, overflow: "hidden" },
    avatar: {
      flex: 1,
      backgroundColor: c.primary + "33",
      borderWidth: 1,
      borderColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32,
    },
    avatarTxt: { color: c.text, fontSize: 22, fontWeight: "900" },

    name: { color: c.text, fontSize: 18, fontWeight: "800" },
    email: { color: c.subtitle, marginTop: 2 },

    badgePlan: {
      alignSelf: "flex-start",
      marginTop: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    badgePlanTxt: { color: c.text, fontWeight: "700", fontSize: 12 },

    cardRow: { gap: 12 },
    card: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 14,
      gap: 10,
    },
    cardTight: { gap: 8 },
    cardTitle: { color: c.text, fontWeight: "800", fontSize: 16 },

    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    rowText: { color: c.text },

    helper: { color: c.subtitle },

    pillOk: {
      alignSelf: "flex-start",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "#2e7d32",
      backgroundColor: "#2e7d3220",
    },
    pillOkTxt: { color: c.text, fontWeight: "700", fontSize: 12 },

    logoutBtn: {
      marginTop: "auto",
      alignSelf: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: "transparent",
    },
    logoutTxt: { color: c.subtitle, fontWeight: "700" },
  });

const badgeColors = (label: string, c: Colors) => {
  switch (label) {
    case "Básico":
      return { backgroundColor: "#2e7d3220", borderColor: "#2e7d32" };
    case "Pro":
      return { backgroundColor: "#2962ff20", borderColor: "#2962ff" };
    case "Premium":
      return { backgroundColor: "#ffd60a20", borderColor: "#ffd60a" };
    default:
      return { backgroundColor: c.card, borderColor: c.border };
  }
};
