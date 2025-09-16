// src/screens/Search.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../contexts/themeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

type Course = {
  id: string;
  title: string;
  category: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string; // "Gratis", "L 299", etc.
  planRequired: "basic" | "pro" | "premium";
  tag?: "Nuevo" | "Pro" | "Premium";
  thumb?: any;
};

const CATEGORIES = ["Todos", "SAR", "SPS", "Excel", "Aduanas", "Auditoría"];

export default function Search() {
  const nav = useNavigation<any>();
  const { theme } = useTheme();
  const { isBasic, isPro, isPremium, plan } = useAuth();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  // mock data (cambiá por tus datos reales)
  const hero = require("../Img/CTL.png");
  const allCourses: Course[] = [
    {
      id: "c1",
      title: "Declaración Mensual SAR paso a paso",
      category: "SAR",
      provider: "CTL Academy",
      rating: 4.8,
      reviews: 2201,
      price: "Gratis",
      planRequired: "basic",
      tag: "Nuevo",
      thumb: hero,
    },
    {
      id: "c2",
      title: "Excel Financiero para KPI y Tableros",
      category: "Excel",
      provider: "CTL Academy",
      rating: 4.7,
      reviews: 1754,
      price: "L 299",
      planRequired: "pro",
      tag: "Pro",
      thumb: hero,
    },
    {
      id: "c3",
      title: "Aduanas: Cálculo CIF, DAI y ejemplos",
      category: "Aduanas",
      provider: "CTL Academy",
      rating: 4.6,
      reviews: 1380,
      price: "L 399",
      planRequired: "pro",
      thumb: hero,
    },
    {
      id: "c4",
      title: "Auditoría fiscal aplicada (casos)",
      category: "Auditoría",
      provider: "CTL Academy",
      rating: 4.7,
      reviews: 980,
      price: "L 699",
      planRequired: "premium",
      tag: "Premium",
      thumb: hero,
    },
    {
      id: "c5",
      title: "SPS: Trámites y requisitos clave",
      category: "SPS",
      provider: "CTL Academy",
      rating: 4.5,
      reviews: 610,
      price: "L 249",
      planRequired: "pro",
      thumb: hero,
    },
  ];

  // estado UI
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [query]);

  // helpers de plan
  const userCanSee = (required: Course["planRequired"]) => {
    if (isPremium) return true;
    if (isPro) return required !== "premium";
    return required === "basic";
  };
  const planLabel = (required: Course["planRequired"]) =>
    required === "basic" ? "Básico" : required === "pro" ? "Pro" : "Premium";
  const lockReason = (required: Course["planRequired"]) => {
    if (userCanSee(required)) return null;
    if (required === "pro" && isBasic) return "Requiere Pro";
    if (required === "premium") return "Requiere Premium";
    return "Bloqueado";
  };

  // filtros
  const filtered = allCourses.filter((c) => {
    const catOK =
      activeCat === "Todos"
        ? true
        : c.category.toLowerCase() === activeCat.toLowerCase();
    const q = debounced;
    const qOK =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q);
    return catOK && qOK;
  });

  // navegación a Subscribe
  const goToSubscribe = (planId: "pro" | "premium") => {
    const price = planId === "pro" ? "L 299" : "L 699";
    const planName = planId === "pro" ? "Pro" : "Premium";
    nav.navigate("Subscribe", { planId, planName, price });
  };

  // Card de curso
  const CourseRow = ({ item }: { item: Course }) => {
    const blockedMsg = lockReason(item.planRequired);
    return (
      <View style={styles.card}>
        <Image source={item.thumb ?? hero} style={styles.cardImg} />
        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View
              style={[
                styles.badgePlan,
                badgeColor(item.planRequired, theme.colors),
              ]}
            >
              <Text style={styles.badgePlanTxt}>
                Incluido en: {planLabel(item.planRequired)}
              </Text>
            </View>
          </View>

          <Text style={styles.cardProvider} numberOfLines={1}>
            {item.provider} • {item.category}
          </Text>
          <Text style={styles.cardMeta}>
            {item.rating.toFixed(1)} ★ ({item.reviews.toLocaleString()}) •{" "}
            {item.price}
          </Text>

          {blockedMsg ? (
            <View style={styles.lockRow}>
              <Text style={styles.lockTxt}>🔒 {blockedMsg}</Text>
              <CustomButton
                title={
                  item.planRequired === "pro"
                    ? "Mejorar a Pro"
                    : "Mejorar a Premium"
                }
                onPress={() =>
                  goToSubscribe(item.planRequired === "pro" ? "pro" : "premium")
                }
                variant="primary"
                // fallback por si tu CustomButton no usa 'variant'
                style={{ backgroundColor: theme.colors.primary }}
                textStyle={{ color: theme.colors.buttonText }}
              />
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              <CustomButton
                title="Ver contenido"
                onPress={() => {
                  /* nav.navigate("CourseDetail", { id: item.id }) */
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* buscador */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar cursos, temas o categorías…"
        placeholderTextColor={theme.colors.placeholder}
        style={styles.searchInput}
      />

      {/* categorías */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveCat(item)}
            style={[styles.chip, activeCat === item && styles.chipActive]}
          >
            <Text
              style={[styles.chipTxt, activeCat === item && styles.chipTxtActive]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsList}
      />

      {/* resultados */}
      {filtered.length ? (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={CourseRow}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTxt}>No hay resultados</Text>
          {!!debounced && (
            <Text style={styles.hintTxt}>
              Probá con otra palabra o categoría.
            </Text>
          )}
        </View>
      )}

      {/* plan actual */}
      <Text style={styles.footerNote}>Tu plan actual: {plan.toUpperCase()}</Text>
    </View>
  );
}

const badgeColor = (required: "basic" | "pro" | "premium", c: any) => {
  switch (required) {
    case "basic":
      return { backgroundColor: "#2e7d3220", borderColor: "#2e7d32" };
    case "pro":
      return { backgroundColor: "#2962ff20", borderColor: "#2962ff" };
    case "premium":
      return { backgroundColor: "#ffd60a20", borderColor: "#ffd60a" };
    default:
      return { backgroundColor: c.card, borderColor: c.border };
  }
};

const makeStyles = (c: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background, padding: 16 },

    searchInput: {
      backgroundColor: c.inputBg,
      color: c.inputText,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 8,
    },

    // chips
chip: {
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 999,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: c.border,
  marginRight: 8,
  alignSelf: "center",   // 👈 evita que se estire
},
chipActive: {
  backgroundColor: c.primary,
  borderColor: c.primary,
},
chipTxt: { 
  color: c.text, 
  fontSize: 14, 
  textAlign: "center"   // 👈 centrado de texto
},
chipTxtActive: { 
  color: c.buttonText, 
  fontWeight: "700" 
},

chipsList: { 
  paddingVertical: 8, 
  alignItems: "center"  // 👈 mantiene todo centrado verticalmente
},


    // results
    resultsList: { paddingTop: 8, paddingBottom: 16 },
    card: {
      flexDirection: "row",
      gap: 12,
      backgroundColor: "transparent", // borde sin fondo
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 10,
    },
    cardImg: {
      width: 86,
      height: 64,
      borderRadius: 8,
      backgroundColor: c.border,
    },
    rowBetween: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardTitle: { color: c.text, fontSize: 16, fontWeight: "800", flex: 1 },
    cardProvider: { color: c.subtitle, marginTop: 2, fontSize: 13 },
    cardMeta: { color: c.text, opacity: 0.9, marginTop: 2, fontSize: 13 },

    badgePlan: {
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      alignSelf: "center",
    },
    badgePlanTxt: { color: c.text, fontSize: 11, fontWeight: "700" },

    lockRow: { marginTop: 8, gap: 8 },
    lockTxt: { color: c.subtitle, fontSize: 13 },

    emptyBox: {
      marginTop: 20,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      gap: 6,
    },
    emptyTxt: { color: c.subtitle },
    hintTxt: { color: c.subtitle, fontSize: 12 },

    footerNote: {
      color: c.subtitle,
      textAlign: "center",
      marginTop: 12,
      fontSize: 11,
      opacity: 0.8,
    },
  });
