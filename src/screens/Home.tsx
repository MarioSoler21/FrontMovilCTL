import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  LayoutChangeEvent,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useTheme } from "../contexts/themeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import { useNavigation } from "@react-navigation/native";

// ===== Tipos =====
type Course = {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string; // "Gratis" | "USD 9.99" | "L 299"
  tag?: "Nuevo" | "Pro" | "Premium";
  thumb?: any;
  category: string;
};

type Post = {
  id: string;
  title: string;
  tag: "Gaceta" | "Aduanas" | "Actualización" | "Blog";
  date: string;
  summary: string;
  image?: any;
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
  const nav = useNavigation<any>();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { user, plan, isBasic, isPro, isPremium } = useAuth();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  const heroImg = require("../Img/CTL.png");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");

  // ===== refs para hacer scroll al scheduler
  const scrollRef = useRef<ScrollView | null>(null);
  const [qaY, setQaY] = useState(0);
  const onQALayout = (e: LayoutChangeEvent) => setQaY(e.nativeEvent.layout.y);
  const scrollToQA = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: qaY - 12, animated: true });
    }
  };

  // ===== DATA MOCK
  const courses: Course[] = [
    { id: "c1", title: "SAR: Declaración Mensual paso a paso", provider: "CTL Academy", rating: 4.8, reviews: 2201, price: "Gratis", tag: "Nuevo", thumb: heroImg, category: "SAR" },
    { id: "c2", title: "Excel Financiero para KPI y Tableros", provider: "CTL Academy", rating: 4.7, reviews: 1754, price: "L 299", tag: "Pro", thumb: heroImg, category: "Excel Financiero" },
    { id: "c3", title: "Aduanas: Cálculo CIF, DAI y ejemplos", provider: "CTL Academy", rating: 4.6, reviews: 1380, price: "L 399", thumb: heroImg, category: "Aduanas" },
    { id: "c4", title: "Auditoría Fiscal: pruebas y papeles de trabajo", provider: "CTL Academy", rating: 4.7, reviews: 980, price: "L 699", tag: "Premium", thumb: heroImg, category: "Auditoría" },
  ];

  const posts: Post[] = [
    { id: "p1", title: "Reformas fiscales publicadas en La Gaceta (jul 2025)", tag: "Gaceta", date: "Jul 18", summary: "Cambios clave que impactan facturación, retenciones y cronograma.", image: heroImg },
    { id: "p2", title: "Aduanas: nueva tabla de aranceles para repuestos", tag: "Aduanas", date: "Jul 15", summary: "Ejemplos prácticos con cálculo de CIF y DAI, errores comunes.", image: heroImg },
    { id: "p3", title: "Actualización SAR: calendario de presentación mensual", tag: "Actualización", date: "Jul 10", summary: "Fechas límite, sanciones y buenas prácticas para cumplir.", image: heroImg },
  ];

  const correoMostrar = (user as any)?.email ?? correo ?? "";

  // ===== GATING por plan
  const courseAllowedByPlan = (c: Course) => {
    if (isPremium) return true;
    if (isPro) return c.tag !== "Premium"; // todo menos premium
    // basic
    return c.price.toLowerCase().includes("gratis");
  };

  const coursesByPlan = courses.filter(courseAllowedByPlan);

  // Filtros UI
  const filteredCourses = coursesByPlan.filter((c) => {
    const catOk = activeCat === "Todos" ? true : c.category === activeCat;
    const q = query.trim().toLowerCase();
    const qOk =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  // ===== Helpers UI
  const Chip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const CourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard} onPress={() => {}}>
      <Image source={item.thumb ?? heroImg} style={styles.courseImg} />
      {item.tag ? (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{item.tag}</Text>
        </View>
      ) : null}
      <View style={styles.courseBody}>
        <Text numberOfLines={2} style={styles.courseTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.courseProvider}>
          {item.provider}
        </Text>
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
        <Text numberOfLines={2} style={styles.postTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={styles.postSummary}>
          {item.summary}
        </Text>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  // ===== Navegar a Subscribe
  const goToSubscribe = (p: { planId: "basic" | "pro" | "premium"; planName: string; price: string }) =>
    nav.navigate("Subscribe", p);

  // ===== Botón de plan (cambia según estado actual)
  const PlanButton = ({
    id,
    name,
    price,
  }: {
    id: "basic" | "pro" | "premium";
    name: string;
    price: string;
  }) => {
    const isCurrent =
      (id === "basic" && isBasic) ||
      (id === "pro" && isPro) ||
      (id === "premium" && isPremium);

    const isPremiumCurrent = id === "premium" && isCurrent;

    return (
      <CustomButton
        title={isPremiumCurrent ? "Agendar Q&A" : isCurrent ? "Tu plan" : "Elegir"}
        onPress={() => {
          if (isPremiumCurrent) {
            scrollToQA();
            return;
          }
          if (!isCurrent) goToSubscribe({ planId: id, planName: name, price });
        }}
        variant={isCurrent ? "secondary" : "primary"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO */}
        <View style={styles.heroWrap}>
          <View style={styles.heroTint} />
          <View style={styles.heroInner}>
            <Text style={styles.heroKicker}>
              Bienvenido{correoMostrar ? `, ${correoMostrar}` : ""}
            </Text>
            <Text style={styles.heroTitle}>Capacítate en Fiscalidad y Operaciones</Text>
            <Text style={styles.heroSub}>
              {isBasic
                ? "Plan Básico activo: lecturas y 2 videos por mes."
                : isPro
                ? "Plan Pro activo: cursos SAR/SPS + Excel + soporte."
                : "Plan Premium activo: todo Pro + Casos y Q&A en vivo."}
            </Text>
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

        {/* COURSES (gated) */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Cursos</Text>
          {!isPremium && (
            <TouchableOpacity onPress={() => goToSubscribe({ planId: "premium", planName: "Premium", price: "L 699" })}>
              <Text style={styles.link}>Mejorar plan</Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.emptyTxt}>No hay cursos disponibles en tu plan o búsqueda.</Text>
          </View>
        )}

        {/* POSTS */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Novedades</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Ver todo</Text>
          </TouchableOpacity>
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
            <PlanButton id="basic" name="Básico" price="Gratis" />
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
            <PlanButton id="pro" name="Pro" price="L 299" />
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
            <PlanButton id="premium" name="Premium" price="L 699" />
          </View>
        </View>

        {/* ===== Q&A MENSUAL (visible solo Premium) ===== */}
        {isPremium && (
          <View onLayout={onQALayout} style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text style={styles.sectionTitle}>Sesión Q&A mensual (Premium)</Text>
            <Text style={{ color: theme.colors.subtitle, marginBottom: 8 }}>
              Agenda una sesión personalizada. Al conectar Google Calendar, se creará el evento con Google Meet.
            </Text>
            <QAScheduler
              email={correoMostrar}
              colors={theme.colors}
              onNeedUpgrade={() => goToSubscribe({ planId: "premium", planName: "Premium", price: "L 699" })}
            />
          </View>
        )}

        <View style={{ height: 28 }} />
        <Text style={styles.footerNote}>
          {`Idioma: ${language.toUpperCase()} • Plan: ${plan.toUpperCase()}`}
        </Text>
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Botón WhatsApp: solo Pro o Premium */}
      {(isPro || isPremium) && (
        <FloatingWhatsapp
          phone="50499998888"
          text={`Hola, soy ${correoMostrar || "un usuario"} con plan ${plan.toUpperCase()}. Necesito soporte.`}
        />
      )}
    </SafeAreaView>
  );
}

// ====== COMPONENTE: QAScheduler (plantilla lista para Calendar) ======
function QAScheduler({
  email,
  colors,
  onNeedUpgrade,
}: {
  email: string;
  colors: Colors;
  onNeedUpgrade: () => void;
}) {
  const c = colors;
  const s = qaStyles(c);

  // estado de conexión a Google Calendar (placeholder)
  const [googleConnected, setGoogleConnected] = useState(false);

  // formulario
  const [topic, setTopic] = useState("");
  const [dateStr, setDateStr] = useState(""); // YYYY-MM-DD
  const [timeStr, setTimeStr] = useState(""); // HH:mm (24h)
  const [durationMin, setDurationMin] = useState("60"); // minutos
  const [mode, setMode] = useState<"meet" | "presencial">("meet");
  const [notes, setNotes] = useState("");

  const tz = "America/Tegucigalpa";

  const handleConnectGoogle = () => {
    // Aquí luego integras OAuth: abrir web auth y guardar token.
    // Por ahora, simula conexión:
    setGoogleConnected(true);
    Alert.alert("Google Calendar", "Conexión simulada. Listo para crear borradores.");
  };

  const validate = () => {
    if (!topic.trim()) return "Escribe un tema.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "Fecha inválida (usa YYYY-MM-DD).";
    if (!/^\d{2}:\d{2}$/.test(timeStr)) return "Hora inválida (usa HH:mm).";
    const dmin = parseInt(durationMin, 10);
    if (isNaN(dmin) || dmin < 15 || dmin > 240) return "Duración entre 15 y 240 minutos.";
    return null;
  };

  const buildRFC3339 = (yyyyMmDd: string, hhMm: string) => {
    // Construye timestamps localizados (sin convertir a UTC aquí).
    // Cuando integres la API, usa timeZone = "America/Tegucigalpa" en el cuerpo del evento.
    const [y, m, d] = yyyyMmDd.split("-").map((n) => parseInt(n, 10));
    const [hh, mm] = hhMm.split(":").map((n) => parseInt(n, 10));
    // Nota: el backend de Google Calendar aceptará { dateTime, timeZone }
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateTime = `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00`;
    return dateTime;
  };

  const handleCreateDraft = () => {
    const err = validate();
    if (err) {
      Alert.alert("Campos faltantes", err);
      return;
    }
    const start = buildRFC3339(dateStr, timeStr);
    const endDate = new Date(`${dateStr}T${timeStr}:00`);
    endDate.setMinutes(endDate.getMinutes() + parseInt(durationMin, 10));
    const pad = (n: number) => String(n).padStart(2, "0");
    const end = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:00`;

    // Borrador listo para Google Calendar API v3 (Events.insert)
    const eventDraft = {
      summary: `Q&A Premium: ${topic}`,
      description: notes || "Sesión Q&A mensual (Premium) con CTL.",
      start: { dateTime: start, timeZone: tz },
      end: { dateTime: end, timeZone: tz },
      attendees: email ? [{ email }] : [],
      conferenceData: mode === "meet" ? { createRequest: { requestId: `${Date.now()}` } } : undefined,
      location: mode === "presencial" ? "Por definir (presencial)" : undefined,
      reminders: { useDefault: true },
    };

    // Si ya estuviera conectado, aquí haces la llamada real:
    // gapi.client.calendar.events.insert({ calendarId: "primary", resource: eventDraft, conferenceDataVersion: 1 })

    console.log("EVENT_DRAFT_READY", eventDraft);
    Alert.alert(
      "Borrador listo",
      googleConnected
        ? "Listo para enviar a Google Calendar (ver consola)."
        : "Conecta Google Calendar para crear el evento real."
    );
  };

  return (
    <View style={s.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={s.title}>Agendar Q&A</Text>
        <TouchableOpacity onPress={handleConnectGoogle} style={[s.connectBtn, googleConnected && { opacity: 0.7 }]}>
          <Text style={s.connectTxt}>{googleConnected ? "Google conectado" : "Conectar Google Calendar"}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 10 }} />

      <Text style={s.label}>Tema</Text>
      <TextInput
        value={topic}
        onChangeText={setTopic}
        placeholder="p. ej., Revisión de KPIs de costos / SAR mensual"
        placeholderTextColor={c.placeholder}
        style={s.input}
      />

      <View style={{ height: 8 }} />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput
            value={dateStr}
            onChangeText={setDateStr}
            placeholder="2025-09-20"
            placeholderTextColor={c.placeholder}
            style={s.input}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Hora (HH:mm)</Text>
          <TextInput
            value={timeStr}
            onChangeText={setTimeStr}
            placeholder="14:30"
            placeholderTextColor={c.placeholder}
            style={s.input}
          />
        </View>
      </View>

      <View style={{ height: 8 }} />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Duración (min)</Text>
          <TextInput
            value={durationMin}
            onChangeText={setDurationMin}
            placeholder="60"
            keyboardType="numeric"
            placeholderTextColor={c.placeholder}
            style={s.input}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Modalidad</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setMode("meet")}
              style={[s.chip, mode === "meet" && s.chipActive]}
            >
              <Text style={[s.chipTxt, mode === "meet" && s.chipTxtActive]}>Meet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode("presencial")}
              style={[s.chip, mode === "presencial" && s.chipActive]}
            >
              <Text style={[s.chipTxt, mode === "presencial" && s.chipTxtActive]}>Presencial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 8 }} />

      <Text style={s.label}>Notas (opcional)</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Enlista preguntas o contexto para la sesión…"
        placeholderTextColor={c.placeholder}
        style={[s.input, { height: 90, textAlignVertical: "top" }]}
        multiline
      />

      <View style={{ height: 12 }} />
      <CustomButton
        title={googleConnected ? "Crear evento en Calendar" : "Crear borrador (conectar Google para enviar)"}
        onPress={handleCreateDraft}
      />

      <Text style={s.helper}>
        Zona horaria: America/Tegucigalpa. Cuando conectes Google, el evento se creará con Meet y se enviará a tu calendario.
      </Text>
    </View>
  );
}

// ===== helpers =====
const tagBg = (tag: Post["tag"], c: any) => {
  switch (tag) {
    case "Gaceta":
      return { backgroundColor: "#5B8DEF20" };
    case "Aduanas":
      return { backgroundColor: "#34C75920" };
    case "Actualización":
      return { backgroundColor: "#FFD60A20" };
    default:
      return { backgroundColor: c.card };
  }
};

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

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    content: { paddingBottom: 24 },

    heroWrap: {
      height: 240,
      marginBottom: 8,
      overflow: "hidden",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    heroTint: { ...StyleSheet.absoluteFillObject, backgroundColor: c.background, opacity: 0.35 },
    heroInner: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, gap: 6 },
    heroKicker: { color: c.text, opacity: 0.9, fontWeight: "700" },
    heroTitle: { color: c.text, fontSize: 22, fontWeight: "900", textAlign: "center" },
    heroSub: { color: c.subtitle, textAlign: "center", marginBottom: 10 },

    searchWrap: { paddingHorizontal: 16, marginTop: 4 },
    searchInput: {
      backgroundColor: c.inputBg,
      color: c.inputText,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },

    chipsList: { paddingHorizontal: 10, paddingVertical: 12, gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      marginHorizontal: 4,
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipTxt: { color: c.text },
    chipTxtActive: { color: c.buttonText, fontWeight: "700" },

    sectionHead: {
      paddingHorizontal: 16,
      paddingTop: 6,
      paddingBottom: 6,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: { color: c.text, fontSize: 18, fontWeight: "800" },
    link: { color: c.subtitle },

    coursesList: { paddingHorizontal: 12, gap: 12 },
    courseCard: {
      width: 250,
      backgroundColor: c.card,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: c.border,
      marginHorizontal: 6,
    },
    courseImg: { width: "100%", height: 120, backgroundColor: c.border },
    courseBody: { padding: 10, gap: 4 },
    courseTitle: { color: c.text, fontWeight: "800" },
    courseProvider: { color: c.subtitle },
    courseRating: { color: c.text, opacity: 0.9 },
    coursePrice: { color: c.text, fontWeight: "900", marginTop: 4 },
    badge: {
      position: "absolute",
      left: 10,
      top: 10,
      backgroundColor: "#E9F5D0",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badgeTxt: { color: "#2E7D32", fontSize: 12, fontWeight: "700" },

    postRow: { flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "center", paddingHorizontal: 16 },
    postImg: { width: 92, height: 64, borderRadius: 8, backgroundColor: c.border },
    tag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 },
    tagTxt: { color: c.text, fontSize: 12 },
    postTitle: { color: c.text, fontWeight: "800", fontSize: 16 },
    postSummary: { color: c.subtitle, marginTop: 2 },
    postDate: { color: c.subtitle, marginTop: 4, fontSize: 12 },
    sep: { height: 1, backgroundColor: c.border, marginHorizontal: 16 },

    pricingWrap: { paddingHorizontal: 12, gap: 10, marginTop: 6 },
    planCard: { backgroundColor: c.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: c.border },
    planPro: { borderColor: c.primary, shadowColor: c.primary, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
    planName: { color: c.text, fontSize: 16, fontWeight: "800" },
    planPrice: { color: c.text, fontSize: 22, fontWeight: "900", marginVertical: 2 },
    planDesc: { color: c.subtitle, marginBottom: 6 },
    planDivider: { height: 1, backgroundColor: c.border, opacity: 0.5, marginVertical: 8 },
    planItem: { color: c.subtitle, marginBottom: 2 },

    emptyBox: { marginHorizontal: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: c.border, alignItems: "center" },
    emptyTxt: { color: c.subtitle },
    footerNote: { color: c.subtitle, textAlign: "center" },
  });

// ===== estilos del scheduler =====
const qaStyles = (c: Colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: c.border,
      gap: 6,
    },
    title: { color: c.text, fontSize: 18, fontWeight: "800" },
    label: { color: c.subtitle, marginBottom: 4 },
    input: {
      backgroundColor: c.inputBg,
      color: c.inputText,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipTxt: { color: c.text },
    chipTxtActive: { color: c.buttonText, fontWeight: "700" },
    connectBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: c.primary,
    },
    connectTxt: { color: c.buttonText, fontWeight: "700" },
    helper: { color: c.subtitle, marginTop: 8, fontSize: 12 },
  });
