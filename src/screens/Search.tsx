// src/screens/Search.tsx
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
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
  price: string;
  planRequired: "basic" | "pro" | "premium";
  tag?: "Nuevo" | "Pro" | "Premium";
  thumb?: any;
  youtubeId: string;
  preview: string;
};

const CATEGORIES = ["Todos", "SAR", "SPS", "Excel Financiero", "Aduanas", "Auditoría", "Consultoría Fiscal"];

export default function Search() {
  const nav = useNavigation<any>();
  const { theme } = useTheme();
  const { isBasic, isPro, isPremium, plan } = useAuth();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  const hero = require("../Img/CTL.png");
  const allCourses: Course[] = [
    { id: "c1", title: "SAR: Declaración Mensual paso a paso", category: "SAR", provider: "CTL Academy", rating: 4.8, reviews: 2201, price: "Gratis", planRequired: "basic", tag: "Nuevo", thumb: hero, youtubeId: "-tcTb3N2DbY", preview: "Aprende a preparar y presentar tu declaración SAR mensual de inicio a fin con ejemplos prácticos." },
    { id: "c5", title: "SAR: Retenciones de ISV y compras exentas", category: "SAR", provider: "CTL Academy", rating: 4.7, reviews: 1560, price: "L 299", planRequired: "pro", tag: "Pro", thumb: hero, youtubeId: "e2m8a0Q9Abc", preview: "Configura retenciones y maneja compras exentas sin errores en tu contabilidad mensual." },
    { id: "c6", title: "SPS: Registro patronal y planillas", category: "SPS", provider: "CTL Academy", rating: 4.6, reviews: 1210, price: "L 299", planRequired: "pro", tag: "Pro", thumb: hero, youtubeId: "9cWmWq1sF1o", preview: "Del alta patronal al envío de planillas, flujo completo con checklist descargable." },
    { id: "c7", title: "SPS: Cálculo de aportaciones y multas", category: "SPS", provider: "CTL Academy", rating: 4.6, reviews: 930, price: "L 399", planRequired: "pro", thumb: hero, youtubeId: "1JtY2dNnP3U", preview: "Evita sanciones con un cálculo correcto de aportaciones y recargos, con casos reales." },
    { id: "c2", title: "Excel Financiero para KPI y Tableros", category: "Excel Financiero", provider: "CTL Academy", rating: 4.7, reviews: 1754, price: "L 299", planRequired: "pro", tag: "Pro", thumb: hero, youtubeId: "pLZ1Y8gP0qk", preview: "Tableros, KPIs y fórmulas clave para controlar costos, margen y flujo de caja en Excel." },
    { id: "c8", title: "Excel: Modelos de costos y márgenes", category: "Excel Financiero", provider: "CTL Academy", rating: 4.7, reviews: 1102, price: "L 399", planRequired: "pro", thumb: hero, youtubeId: "q3mD5QX5k0Y", preview: "Construye un modelo de costos con sensibilidad de precios, margen y punto de equilibrio." },
    { id: "c3", title: "Aduanas: Cálculo CIF, DAI y ejemplos", category: "Aduanas", provider: "CTL Academy", rating: 4.6, reviews: 1380, price: "L 399", planRequired: "pro", thumb: hero, youtubeId: "q9F3OeY2v9E", preview: "Calcula CIF y DAI con casos reales y evita errores frecuentes al nacionalizar mercancías." },
    { id: "c9", title: "Aduanas: Clasificación arancelaria básica", category: "Aduanas", provider: "CTL Academy", rating: 4.5, reviews: 860, price: "Gratis", planRequired: "basic", tag: "Nuevo", thumb: hero, youtubeId: "Xw8J1v0n7Rs", preview: "Guía introductoria para clasificar mercancías con seguridad y ahorrar tiempo en trámites." },
    { id: "c4", title: "Auditoría Fiscal: pruebas y papeles de trabajo", category: "Auditoría", provider: "CTL Academy", rating: 4.7, reviews: 980, price: "L 699", planRequired: "premium", tag: "Premium", thumb: hero, youtubeId: "xX3lY8TtM1c", preview: "Metodologías, riesgos y papeles de trabajo para auditorías fiscales eficientes." },
    { id: "c10", title: "Auditoría de cumplimiento: checklist y hallazgos", category: "Auditoría", provider: "CTL Academy", rating: 4.7, reviews: 1040, price: "L 699", planRequired: "premium", tag: "Premium", thumb: hero, youtubeId: "mN7G0Q9pTgU", preview: "Prepara un checklist efectivo y documenta hallazgos con evidencia y materialidad." },
    { id: "c11", title: "Consultoría Fiscal: diagnóstico express", category: "Consultoría Fiscal", provider: "CTL Academy", rating: 4.6, reviews: 770, price: "Gratis", planRequired: "basic", tag: "Nuevo", thumb: hero, youtubeId: "2HjvZxT1KkE", preview: "Aprende a realizar un diagnóstico rápido para detectar riesgos y oportunidades tributarias." },
    { id: "c12", title: "Consultoría Fiscal: estructura de honorarios", category: "Consultoría Fiscal", provider: "CTL Academy", rating: 4.6, reviews: 690, price: "L 299", planRequired: "pro", tag: "Pro", thumb: hero, youtubeId: "Bf0wY2rQ9sE", preview: "Cómo cotizar: alcance, entregables, valor vs. horas y manejo de revisiones." }
  ];

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [query]);

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

  const filtered = allCourses.filter((c) => {
    const catOK = activeCat === "Todos" ? true : c.category.toLowerCase() === activeCat.toLowerCase();
    const q = debounced;
    const qOK =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q);
    return catOK && qOK;
  });

  const goToSubscribe = (planId: "pro" | "premium") => {
    const price = planId === "pro" ? "L 299" : "L 699";
    const planName = planId === "pro" ? "Pro" : "Premium";
    nav.navigate("Subscribe", { planId, planName, price });
  };

  const CourseRow = ({ item }: { item: Course }) => {
    const blockedMsg = lockReason(item.planRequired);
    return (
      <View style={styles.card}>
        <Image source={item.thumb ?? hero} style={styles.cardImg} />
        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <View style={[styles.badgePlan, badgeColor(item.planRequired, theme.colors)]}>
              <Text style={styles.badgePlanTxt}>Incluido en: {planLabel(item.planRequired)}</Text>
            </View>
          </View>

          <Text style={styles.cardProvider} numberOfLines={1}>{item.provider} • {item.category}</Text>
          <Text style={styles.cardMeta}>{item.rating.toFixed(1)} ★ ({item.reviews.toLocaleString()}) • {item.price}</Text>

          {blockedMsg ? (
            <View style={styles.lockRow}>
              <Text style={styles.lockTxt}>🔒 {blockedMsg}</Text>
              <CustomButton
                title={item.planRequired === "pro" ? "Mejorar a Pro" : "Mejorar a Premium"}
                onPress={() => goToSubscribe(item.planRequired === "pro" ? "pro" : "premium")}
                variant="primary"
                style={{ backgroundColor: theme.colors.primary }}
                textStyle={{ color: theme.colors.buttonText }}
              />
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              <CustomButton
                title="Ver contenido"
                onPress={() => nav.navigate("CourseDetail", { course: item })}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar cursos, temas o categorías…"
        placeholderTextColor={theme.colors.placeholder}
        style={styles.searchInput}
      />

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setActiveCat(item)} style={[styles.chip, activeCat === item && styles.chipActive]}>
            <Text style={[styles.chipTxt, activeCat === item && styles.chipTxtActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsList}
      />

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
          {!!debounced && <Text style={styles.hintTxt}>Probá con otra palabra o categoría.</Text>}
        </View>
      )}

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
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: c.border,
      marginRight: 8,
      alignSelf: "center",
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipTxt: { color: c.text, fontSize: 15 },
    chipTxtActive: { color: c.buttonText, fontWeight: "700" },
    chipsList: { paddingHorizontal: 10, paddingVertical: 12, gap: 8 },
    resultsList: { paddingTop: 8, paddingBottom: 16 },
    card: {
      flexDirection: "row",
      gap: 12,
      backgroundColor: "transparent",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 10,
    },
    cardImg: { width: 86, height: 64, borderRadius: 8, backgroundColor: c.border },
    rowBetween: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardTitle: { color: c.text, fontSize: 16, fontWeight: "800", flex: 1 },
    cardProvider: { color: c.subtitle, marginTop: 2, fontSize: 13 },
    cardMeta: { color: c.text, opacity: 0.9, marginTop: 2, fontSize: 13 },
    badgePlan: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignSelf: "center" },
    badgePlanTxt: { color: c.text, fontSize: 11, fontWeight: "700" },
    lockRow: { marginTop: 8, gap: 8 },
    lockTxt: { color: c.subtitle, fontSize: 13 },
    emptyBox: { marginTop: 20, padding: 19, borderRadius: 8, borderWidth: 1, borderColor: c.border, alignItems: "center", gap: 6 },
    emptyTxt: { color: c.subtitle },
    hintTxt: { color: c.subtitle, fontSize: 12 },
    footerNote: { color: c.subtitle, textAlign: "center", marginTop: 12, fontSize: 11, opacity: 0.8 },
  });
