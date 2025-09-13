// src/screens/Home.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../contexts/themeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";

// ===== Tipos =====
type Course = {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string; // "Gratis" | "USD 9.99" | "L 299"
  tag?: string;  // "Nuevo" | "Pro" | "Premium"
  thumb?: any;   // require(..) o { uri }
  category: string;
};

type Post = {
  id: string;
  title: string;
  tag: "Gaceta" | "Aduanas" | "Actualización" | "Blog";
  date: string;
  summary: string;
  image?: any;   // require(..) o { uri }
};

const CATEGORIES = [
  "Todos",
  "Consultoría Fiscal",
  "Auditoría",
  "SAR",
  "SPS",
  "Excel Financiero",
  "Gaceta",
  "Aduanas",
];

export default function Home({ correo }: { correo?: string }) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  // ====== DATA MOCK (luego lo reemplazas por API/Firestore) ======
  const heroImg = require("../Img/CTL.png");

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");

  const courses: Course[] = [
    {
      id: "c1",
      title: "SAR: Declaración Mensual paso a paso",
      provider: "CTL Academy",
      rating: 4.8,
      reviews: 2201,
      price: "Gratis",
      tag: "Nuevo",
      thumb: heroImg,
      category: "SAR",
    },
    {
      id: "c2",
      title: "Excel Financiero para KPI y Tableros",
      provider: "CTL Academy",
      rating: 4.7,
      reviews: 1754,
      price: "USD 9.99",
      tag: "Pro",
      thumb: heroImg,
      category: "Excel Financiero",
    },
    {
      id: "c3",
      title: "Aduanas: Cálculo CIF, DAI y ejemplos",
      provider: "CTL Academy",
      rating: 4.6,
      reviews: 1380,
      price: "USD 12.99",
      thumb: heroImg,
      category: "Aduanas",
    },
    {
      id: "c4",
      title: "Auditoría Fiscal: pruebas y papeles de trabajo",
      provider: "CTL Academy",
      rating: 4.7,
      reviews: 980,
      price: "USD 14.99",
      tag: "Premium",
      thumb: heroImg,
      category: "Auditoría",
    },
  ];

  const posts: Post[] = [
    {
      id: "p1",
      title: "Reformas fiscales publicadas en La Gaceta (jul 2025)",
      tag: "Gaceta",
      date: "Jul 18",
      summary: "Cambios clave que impactan facturación, retenciones y cronograma.",
      image: heroImg,
    },
    {
      id: "p2",
      title: "Aduanas: nueva tabla de aranceles para repuestos",
      tag: "Aduanas",
      date: "Jul 15",
      summary: "Ejemplos prácticos con cálculo de CIF y DAI, errores comunes.",
      image: heroImg,
    },
    {
      id: "p3",
      title: "Actualización SAR: calendario de presentación mensual",
      tag: "Actualización",
      date: "Jul 10",
      summary: "Fechas límite, sanciones y buenas prácticas para cumplir.",
      image: heroImg,
    },
  ];

  const correoMostrar = (user as any)?.email ?? correo ?? "";

  // ====== FILTROS ======
  const filteredCourses = courses.filter((c) => {
    const catOk = activeCat === "Todos" ? true : c.category === activeCat;
    const q = query.trim().toLowerCase();
    const qOk =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  // ====== RENDERERS ======
  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const CourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard} onPress={() => {}}>
      <Image source={item.thumb ?? heroImg} style={styles.courseImg} />
      {item.tag ? (
        <View style={styles.badge}><Text style={styles.badgeTxt}>{item.tag}</Text></View>
      ) : null}
      <View style={styles.courseBody}>
        <Text numberOfLines={2} style={styles.courseTitle}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.courseProvider}>{item.provider}</Text>
        <Text style={styles.courseRating}>
          {`${item.rating.toFixed(1)} ★ (${item.reviews.toLocaleString()})`}
        </Text>
        <Text style={styles.coursePrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const PostRow = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postRow} onPress={() => {}}>
      <Image source={item.image ?? heroImg} style={styles.postImg} />
      <View style={{ flex: 1 }}>
        <View style={[styles.tag, tagBg(item.tag, theme.colors)]}>
          <Text style={styles.tagTxt}>{item.tag}</Text>
        </View>
        <Text numberOfLines={2} style={styles.postTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.postSummary}>{item.summary}</Text>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  // ====== UI ======
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* HERO */}
        <View style={styles.heroWrap}>
            <View style={styles.heroTint} />
            <View style={styles.heroInner}>
              <Text style={styles.heroKicker}>Bienvenido{correoMostrar ? `, ${correoMostrar}` : ""}</Text>
              <Text style={styles.heroTitle}>Capacítate en Fiscalidad y Operaciones</Text>
              <Text style={styles.heroSub}>Cursos y guías prácticas: SAR, SPS, Auditoría, Excel Financiero, Gaceta y Aduanas.</Text>
              <View style={{ width: 180 }}>
                <CustomButton title="Empezar ahora" onPress={() => {}} />
              </View>
            </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar cursos, temas o categorías…"
            placeholderTextColor={theme.colors.placeholder}
            style={styles.searchInput}
          />
        </View>

        {/* CATEGORIES */}
        <FlatList
          data={CATEGORIES}
          keyExtractor={(i) => i}
          renderItem={({ item }) => (
            <Chip label={item} active={item === activeCat} onPress={() => setActiveCat(item)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsList}
        />

        {/* COURSES */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Cursos</Text>
          <TouchableOpacity><Text style={styles.link}>Ver todos</Text></TouchableOpacity>
        </View>
        {filteredCourses.length ? (
          <FlatList
            data={filteredCourses}
            keyExtractor={(i) => i.id}
            renderItem={CourseCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesList}
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTxt}>No hay cursos para esta búsqueda.</Text>
          </View>
        )}

        {/* POSTS / NOVEDADES */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Novedades</Text>
          <TouchableOpacity><Text style={styles.link}>Ver todo</Text></TouchableOpacity>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(i) => i.id}
          renderItem={PostRow}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        {/* PRICING / PLANES */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Planes</Text>
        </View>
        <View style={styles.pricingWrap}>
          <View style={styles.planCard}>
            <Text style={styles.planName}>Básico</Text>
            <Text style={styles.planPrice}>Gratis</Text>
            <Text style={styles.planDesc}>Blog + 2 videos por mes.</Text>
            <View style={styles.planDivider} />
            <Text style={styles.planItem}>• Lecturas (Gaceta/Aduanas)</Text>
            <Text style={styles.planItem}>• Tips SAR mensuales</Text>
            <View style={{ height: 10 }} />
            <CustomButton title="Elegir" onPress={() => {}} />
          </View>

          <View style={[styles.planCard, styles.planPro]}>
            <Text style={styles.planName}>Pro</Text>
            <Text style={styles.planPrice}>L 299</Text>
            <Text style={styles.planDesc}>Cursos SAR + Excel + Soporte básico.</Text>
            <View style={styles.planDivider} />
            <Text style={styles.planItem}>• Cursos completos SAR y SPS</Text>
            <Text style={styles.planItem}>• Excel Financiero aplicado</Text>
            <Text style={styles.planItem}>• Soporte por WhatsApp</Text>
            <View style={{ height: 10 }} />
            <CustomButton title="Elegir" onPress={() => {}} />
          </View>

          <View style={styles.planCard}>
            <Text style={styles.planName}>Premium</Text>
            <Text style={styles.planPrice}>L 699</Text>
            <Text style={styles.planDesc}>Todo Pro + Casos y Q&A en vivo.</Text>
            <View style={styles.planDivider} />
            <Text style={styles.planItem}>• Auditoría fiscal aplicada</Text>
            <Text style={styles.planItem}>• Plantillas y checklists</Text>
            <Text style={styles.planItem}>• Sesiones Q&A mensuales</Text>
            <View style={{ height: 10 }} />
            <CustomButton title="Elegir" onPress={() => {}} />
          </View>
        </View>

        <View style={{ height: 28 }} />
        <Text style={styles.footerNote}>{`Idioma: ${language.toUpperCase()}`}</Text>
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== helpers =====
const tagBg = (tag: Post["tag"], c: any) => {
  switch (tag) {
    case "Gaceta": return { backgroundColor: "#5B8DEF20" };
    case "Aduanas": return { backgroundColor: "#34C75920" };
    case "Actualización": return { backgroundColor: "#FFD60A20" };
    default: return { backgroundColor: c.card };
  }
};

// ===== estilos con theme =====
type Colors = {
  background: string; card: string; text: string; subtitle: string; primary: string;
  border: string; inputBg: string; inputText: string; placeholder: string; buttonText: string;
};

const makeStyles = (c: Colors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  content: { paddingBottom: 24 },

  // HERO
  heroWrap: { height: 240, marginBottom: 8, overflow: "hidden", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroBg: { flex: 1 },
  heroTint: { ...StyleSheet.absoluteFillObject, backgroundColor: c.background, opacity: 0.35 },
  heroInner: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, gap: 6 },
  heroKicker: { color: c.text, opacity: 0.9, fontWeight: "700" },
  heroTitle: { color: c.text, fontSize: 22, fontWeight: "900", textAlign: "center" },
  heroSub: { color: c.subtitle, textAlign: "center", marginBottom: 10 },

  // SEARCH
  searchWrap: { paddingHorizontal: 16, marginTop: 4 },
  searchInput: {
    backgroundColor: c.inputBg,
    color: c.inputText,
    borderWidth: 1, borderColor: c.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },

  // CHIPS
  chipsList: { paddingHorizontal: 10, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
    backgroundColor: c.card, borderWidth: 1, borderColor: c.border, marginHorizontal: 4,
  },
  chipActive: { backgroundColor: c.primary, borderColor: c.primary },
  chipTxt: { color: c.text },
  chipTxtActive: { color: c.buttonText, fontWeight: "700" },

  // SECTION
  sectionHead: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: c.text, fontSize: 18, fontWeight: "800" },
  link: { color: c.subtitle },

  // COURSES
  coursesList: { paddingHorizontal: 12, gap: 12 },
  courseCard: { width: 250, backgroundColor: c.card, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: c.border, marginHorizontal: 6 },
  courseImg: { width: "100%", height: 120, backgroundColor: c.border },
  courseBody: { padding: 10, gap: 4 },
  courseTitle: { color: c.text, fontWeight: "800" },
  courseProvider: { color: c.subtitle },
  courseRating: { color: c.text, opacity: 0.9 },
  coursePrice: { color: c.text, fontWeight: "900", marginTop: 4 },
  badge: { position: "absolute", left: 10, top: 10, backgroundColor: "#E9F5D0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeTxt: { color: "#2E7D32", fontSize: 12, fontWeight: "700" },

  // POSTS
  postRow: { flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "center", paddingHorizontal: 16 },
  postImg: { width: 92, height: 64, borderRadius: 8, backgroundColor: c.border },
  tag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 },
  tagTxt: { color: c.text, fontSize: 12 },
  postTitle: { color: c.text, fontWeight: "800", fontSize: 16 },
  postSummary: { color: c.subtitle, marginTop: 2 },
  postDate: { color: c.subtitle, marginTop: 4, fontSize: 12 },
  sep: { height: 1, backgroundColor: c.border, marginHorizontal: 16 },

  // PRICING
  pricingWrap: { paddingHorizontal: 12, gap: 10, marginTop: 6 },
  planCard: { backgroundColor: c.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: c.border },
  planPro: { borderColor: c.primary, shadowColor: c.primary, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  planName: { color: c.text, fontSize: 16, fontWeight: "800" },
  planPrice: { color: c.text, fontSize: 22, fontWeight: "900", marginVertical: 2 },
  planDesc: { color: c.subtitle, marginBottom: 6 },
  planDivider: { height: 1, backgroundColor: c.border, opacity: 0.5, marginVertical: 8 },
  planItem: { color: c.subtitle, marginBottom: 2 },

  // FOOTER
  emptyBox: { marginHorizontal: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: c.border, alignItems: "center" },
  emptyTxt: { color: c.subtitle },
  footerNote: { color: c.subtitle, textAlign: "center" },
});
