// src/screens/Featured.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import { useTheme } from "../contexts/themeContext";

type Post = {
  id: string;
  title: string;
  tag: "Gaceta" | "Aduanas" | "Actualización" | "Blog";
  summary: string;
  date: string;
};

type Colors = {
  background: string; card: string; text: string; subtitle: string; primary: string;
  border: string; inputBg: string; inputText: string; placeholder: string; buttonText: string;
};

// 👇 Prop que MainTabs nos pasa para cambiar a Home (learning)
type FeaturedProps = { onSeeAll?: () => void };

export default function Featured({ onSeeAll }: FeaturedProps) {
  const { theme } = useTheme();
  const s = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const logoLaMundial = require("../Img/Lamundial.png");
  const logoLaPrensa  = require("../Img/Laprensa.png");
  const logoInfra     = require("../Img/Infra.png");
  const logoCorrugados= require("../Img/Corrugados.png");
  const hero          = require("../Img/CTL.png");

  const IMG_GACETA   = require("../Img/Gaceta.png");
  const IMG_ADUANAS  = require("../Img/aduanas.jpg");

  const posts: Post[] = [
    { id: "p1", title: "Reformas fiscales de julio 2025 publicadas en La Gaceta", tag: "Gaceta", summary: "Cambios que impactan facturación y retenciones.", date: "Jul 18" },
    { id: "p2", title: "Aduanas: nueva tabla de aranceles para importación de repuestos", tag: "Aduanas", summary: "Cálculos de CIF, DAI y ejemplos prácticos.", date: "Jul 15" },
    { id: "p3", title: "Actualización SAR: calendario de presentación mensual", tag: "Actualización", summary: "Fechas límite, sanciones y buenas prácticas.", date: "Jul 10" },
  ];

  const imgForTag = (t: Post["tag"]) => (t === "Gaceta" ? IMG_GACETA : t === "Aduanas" ? IMG_ADUANAS : hero);

  const PostRow = ({ item }: { item: Post }) => (
    <Pressable style={s.postRow} onPress={() => onSeeAll?.()}>
      <Image source={imgForTag(item.tag)} style={s.postImg} />
      <View style={{ flex: 1 }}>
        <View style={[s.tag, tagBg(item.tag, theme.colors)]}>
          <Text style={s.tagTxt}>{item.tag}</Text>
        </View>
        <Text numberOfLines={2} style={s.postTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={s.postSummary}>{item.summary}</Text>
        <Text style={s.postDate}>{item.date}</Text>
      </View>
    </Pressable>
  );

  const Header = () => (
    <View>
      <View style={s.welcome}>
        <Text style={s.welcomeTitle}>Bienvenido</Text>
        <Text style={s.welcomeSub}>Novedades, cambios legales y guías rápidas</Text>
      </View>

      <View style={s.trustedWrap}>
        <Text style={s.trustedTitle}>Las principales empresas confían en CTL</Text>
        <View style={s.trustedLogos}>
          <Image source={logoLaMundial}  style={s.trustedLogo} resizeMode="contain" />
          <Image source={logoLaPrensa}   style={s.trustedLogo} resizeMode="contain" />
          <Image source={logoInfra}      style={s.trustedLogo} resizeMode="contain" />
          <Image source={logoCorrugados} style={s.trustedLogo} resizeMode="contain" />
        </View>
      </View>

      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>Esto es lo nuevo del mes</Text>
        <Pressable onPress={() => onSeeAll?.()}>
          <Text style={s.seeAll}>Ver todo</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.root}
      data={posts}
      renderItem={PostRow}
      keyExtractor={(i) => i.id}
      ItemSeparatorComponent={() => <View style={s.sep} />}
      ListHeaderComponent={Header}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}

const tagBg = (t: Post["tag"], c: Colors) => {
  switch (t) {
    case "Gaceta":        return { backgroundColor: "#5B8DEF20" };
    case "Aduanas":       return { backgroundColor: "#34C75920" };
    case "Actualización": return { backgroundColor: "#FFD60A20" };
    default:              return { backgroundColor: "#9B9B9B20" };
  }
};

const makeStyles = (c: Colors) => {
  const muted = c.subtitle;
  return {
    root: { flex: 1, backgroundColor: c.background } as const,

    welcome: { paddingTop: 16, paddingBottom: 8 } as const,
    welcomeTitle: { color: c.text, fontSize: 24, fontWeight: "800" } as const,
    welcomeSub: { color: muted, marginTop: 4 } as const,

    trustedWrap: { borderWidth: 1, borderColor: "#444", borderRadius: 12, padding: 16, marginTop: 12, backgroundColor: "transparent" } as const,
    trustedTitle: { color: "#f5f0f0ff", fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 12 } as const,
    trustedLogos: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 19 } as const,
    trustedLogo: { width: 80, height: 40, margin: 5 } as const,

    sectionHead: { paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" } as const,
    sectionTitle: { color: c.text, fontSize: 20, fontWeight: "800" } as const,
    seeAll: { color: muted } as const,

    postRow: { flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "center" } as const,
    postImg: { width: 92, height: 64, borderRadius: 8, backgroundColor: c.border, resizeMode: "cover" } as const,

    tag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 } as const,
    tagTxt: { color: c.text, fontSize: 12 } as const,
    postTitle: { color: c.text, fontSize: 16, fontWeight: "700" } as const,
    postSummary: { color: muted, marginTop: 2 } as const,
    postDate: { color: muted, marginTop: 4, fontSize: 12 } as const,

    sep: { height: 1, backgroundColor: c.border } as const,
  };
};
