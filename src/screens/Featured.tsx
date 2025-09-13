// src/screens/Featured.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, Image, Pressable, RefreshControl, ScrollView } from "react-native";
import { useTheme } from "../contexts/themeContext";

// Tipo de datos de los posts
type Post = {
  id: string;
  title: string;
  tag: "Gaceta" | "Aduanas" | "Actualización" | "Blog";
  summary: string;
  date: string;
  imageUrl?: any; // <- soporta require()
};

export default function Featured() {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Logos locales
  const logoLaMundial = require("../Img/Lamundial.png");
  const logoLaPrensa  = require("../Img/Laprensa.png");

  // Noticias
  const posts: Post[] = [
    {
      id: "p1",
      title: "Reformas fiscales de julio 2025 publicadas en La Gaceta",
      tag: "Gaceta",
      summary: "Cambios que impactan facturación y retenciones.",
      date: "Jul 18",
      imageUrl: require("../Img/CTL.png"),
    },
    {
      id: "p2",
      title: "Aduanas: nueva tabla de aranceles para importación de repuestos",
      tag: "Aduanas",
      summary: "Cálculos de CIF, DAI y ejemplos prácticos.",
      date: "Jul 15",
      imageUrl: require("../Img/CTL.png"),
    },
    {
      id: "p3",
      title: "Actualización SAR: calendario de presentación mensual",
      tag: "Actualización",
      summary: "Fechas límite, sanciones y buenas prácticas.",
      date: "Jul 10",
      imageUrl: require("../Img/CTL.png"),
    },
  ];

  const PostRow = ({ item }: { item: Post }) => (
    <Pressable style={styles.postRow} onPress={() => {}}>
      {item.imageUrl ? (
        <Image source={item.imageUrl} style={styles.postImg} />
      ) : (
        <View style={styles.postImgFallback} />
      )}
      <View style={{ flex: 1 }}>
        <View style={[styles.tag, tagBg(item.tag)]}>
          <Text style={styles.tagTxt}>{item.tag}</Text>
        </View>
        <Text numberOfLines={2} style={styles.postTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.postSummary}>{item.summary}</Text>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.root}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.text} />
      }
    >
      {/* Bienvenida */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeSub}>Novedades, cambios legales y guías rápidas</Text>
      </View>

      {/* Logos en rectángulo (sustituye al hero anterior) */}
      <View style={styles.trustedWrap}>
        <Text style={styles.trustedTitle}>Las principales empresas confían en CTL</Text>
        <View style={styles.trustedLogos}>
          <Image source={logoLaMundial} style={styles.trustedLogo} resizeMode="contain" />
          <Image source={logoLaPrensa}  style={styles.trustedLogo} resizeMode="contain" />
        </View>
        
      </View>

      {/* Noticias */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Esto es lo nuevo del mes</Text>
        <Pressable><Text style={styles.seeAll}>Ver todo</Text></Pressable>
      </View>

      <FlatList
        data={posts}
        renderItem={PostRow}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </ScrollView>
  );
}

const tagBg = (t: Post["tag"]) => {
  switch (t) {
    case "Gaceta": return { backgroundColor: "#5B8DEF20" };
    case "Aduanas": return { backgroundColor: "#34C75920" };
    case "Actualización": return { backgroundColor: "#FFD60A20" };
    default: return { backgroundColor: "#9B9B9B20" };
  }
};

type Colors = {
  background: string; card: string; text: string; subtitle: string; primary: string;
  border: string; inputBg: string; inputText: string; placeholder: string; buttonText: string;
};
const makeStyles = (c: Colors) => {
  const muted = c.subtitle;
  return {
    root: { flex: 1, backgroundColor: c.background } as const,

    welcome: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 } as const,
    welcomeTitle: { color: c.text, fontSize: 24, fontWeight: "800" } as const,
    welcomeSub: { color: muted, marginTop: 4 } as const,


    trustedWrap: {
      marginHorizontal: 16,
      marginTop: 8,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
    } as const,
    trustedTitle: {
      color: c.text,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 10,
    } as const,
    trustedLogos: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      width: "100%",
      paddingVertical: 6,
    } as const,
    trustedLogo: {
      height: 28,
      width: 110,
    } as const,
    trustedCTA: {
      color: c.primary,
      fontWeight: "700",
      marginTop: 10,
    } as const,

    sectionHead: {
      paddingHorizontal: 16, paddingTop: 16,
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    } as const,
    sectionTitle: { color: c.text, fontSize: 20, fontWeight: "800" } as const,
    seeAll: { color: muted } as const,

    postRow: { flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "center" } as const,
    postImg: { width: 92, height: 64, borderRadius: 8, backgroundColor: c.border, resizeMode: "cover" } as const,
    postImgFallback: { width: 92, height: 64, borderRadius: 8, backgroundColor: c.card } as const,

    tag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 } as const,
    tagTxt: { color: c.text, fontSize: 12 } as const,
    postTitle: { color: c.text, fontSize: 16, fontWeight: "700" } as const,
    postSummary: { color: muted, marginTop: 2 } as const,
    postDate: { color: muted, marginTop: 4, fontSize: 12 } as const,
    sep: { height: 1, backgroundColor: c.border, marginHorizontal: 16 } as const,
  };
};
