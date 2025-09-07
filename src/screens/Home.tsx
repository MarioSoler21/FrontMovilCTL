
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import CustomButton from "../components/CustomButton";

type Video = { id: string; title: string; thumb: string; duration: string };
type Announcement = { id: string; title: string; body: string };
type Plan = { id: string; name: string; price: string; desc: string; features: string[] };

export default function Home({ correo }: { correo?: string }) {
  const { user } = useAuth();
  const { language } = useLanguage();

  const featuredVideos: Video[] = [
    { id: "v1", title: "SAR: Declaración Mensual", thumb: "https://placehold.co/320x200/png?text=SAR", duration: "12:45" },
    { id: "v2", title: "SPSS: Introducción",       thumb: "https://placehold.co/320x200/png?text=SPSS", duration: "08:10" },
    { id: "v3", title: "Factura Electrónica",       thumb: "https://placehold.co/320x200/png?text=FE",   duration: "09:32" },
  ];

  const announcements: Announcement[] = [
    { id: "a1", title: "Actualización SAR 2025", body: "Cambios en formatos y fechas límite." },
    { id: "a2", title: "Taller SPSS - Básico",   body: "Sesión práctica este viernes." },
  ];

  const plans: Plan[] = [
    { id: "p1", name: "Básico",   price: "L 0",   desc: "Acceso a material libre.", features: ["Lecturas", "2 videos"] },
    { id: "p2", name: "Pro",      price: "L 299", desc: "Para estudiantes.",        features: ["Cursos SAR", "SPSS básico", "Soporte por WhatsApp"] },
    { id: "p3", name: "Premium",  price: "L 699", desc: "Para equipos.",            features: ["Todo Pro", "Casos prácticos", "Plantillas + Q&A"] },
  ];

  const renderVideo = ({ item }: { item: Video }) => (
    <TouchableOpacity style={styles.videoCard}>
      <Image source={{ uri: item.thumb }} style={styles.videoThumb} />
      <View style={styles.badge}><Text style={styles.badgeText}>{item.duration}</Text></View>
      <Text numberOfLines={2} style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.announceCard}>
      <Text style={styles.announceTitle}>{item.title}</Text>
      <Text style={styles.announceBody} numberOfLines={2}>{item.body}</Text>
    </View>
  );

  const Empty = ({ text }: { text: string }) => (
    <View style={styles.emptyBox}><Text style={styles.emptyText}>{text}</Text></View>
  );

  const correoMostrar = (user as any)?.email ?? correo ?? "";

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>


        <View style={styles.heroWrap}>
          <ImageBackground
            source={{ uri: "" }}  
            style={styles.heroBg}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Consultoría Fiscal <Text style={styles.heroBadge}>Profesional</Text>
              </Text>
              <Text style={styles.heroSub}>
                Es nuestro valor más grande. Contáctenos hoy para agendar una consulta.
              </Text>
              <CustomButton title="Consultemos" onPress={() => {}} />
            </View>
          </ImageBackground>
        </View>

 
        <View style={styles.header}>
          <Text style={styles.welcome}>
            {`Bienvenido${correoMostrar ? `, ${correoMostrar}` : ""}`}
          </Text>
          <Text style={styles.subtle}>{`Idioma: ${language.toUpperCase()}`}</Text>
        </View>


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Videos destacados</Text>
          <TouchableOpacity><Text style={styles.linkText}>Ver todos</Text></TouchableOpacity>
        </View>
        {featuredVideos.length ? (
          <FlatList
            data={featuredVideos}
            keyExtractor={(i) => i.id}
            renderItem={renderVideo}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          />
        ) : (<Empty text="No hay videos para mostrar" />)}

  
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Anuncios</Text>
          <TouchableOpacity><Text style={styles.linkText}>Ver más</Text></TouchableOpacity>
        </View>
        {announcements.length ? (
          <FlatList
            data={announcements}
            keyExtractor={(i) => i.id}
            renderItem={renderAnnouncement}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          />
        ) : (<Empty text="No hay anuncios disponibles" />)}

 
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Planes</Text></View>
        <View style={styles.plansWrap}>
          {plans.map((p) => (
            <View key={p.id} style={styles.planCard}>
              <Text style={styles.planName}>{p.name}</Text>
              <Text style={styles.planPrice}>{p.price}</Text>
              <Text style={styles.planDesc}>{p.desc}</Text>
              <View style={styles.planDivider} />
              {p.features.map((f, idx) => (<Text key={idx} style={styles.planFeature}>• {f}</Text>))}
              <View style={{ height: 10 }} />
              <CustomButton title="Seleccionar" onPress={() => {}} />
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const C = {
  bg: "#0B1026",
  hero: "#1a237e",
  card: "#1E1B4B",
  border: "#3B82F6",
  accent: "#6D28D9",
  text: "#F5F3FF",
  sub: "#BFDBFE",
  dim: "#93C5FD",
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 24 },


  heroWrap: {
    height: 260,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  heroBg: { flex: 1 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.hero,
    opacity: 0.9,
  },
  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  heroTitle: { color: C.text, fontSize: 28, fontWeight: "900", textAlign: "center" },
  heroBadge: {
    backgroundColor: C.border,
    color: "#fff",
    paddingHorizontal: 6,
    borderRadius: 6,
    overflow: "hidden",
  },
  heroSub: { color: C.sub, marginTop: 8, marginBottom: 14, textAlign: "center" },

  // Encabezado
  header: { paddingHorizontal: 16, marginTop: 4, marginBottom: 6 },
  welcome: { color: C.text, fontSize: 18, fontWeight: "800" },
  subtle: { color: C.sub, marginTop: 2 },

  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: C.dim, fontSize: 16, fontWeight: "800" },
  linkText: { color: C.sub, fontWeight: "700", paddingVertical: 6, paddingHorizontal: 8 },
  hList: { paddingHorizontal: 12 },

  videoCard: {
    width: 200,
    marginHorizontal: 6,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  videoThumb: { width: "100%", height: 110, borderRadius: 8, backgroundColor: "#111" },
  badge: {
    position: "absolute", top: 12, right: 12,
    backgroundColor: "rgba(59,130,246,0.9)",
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  videoTitle: { color: C.text, marginTop: 8, fontWeight: "700" },

  announceCard: {
    width: 260,
    marginHorizontal: 6,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.accent,
  },
  announceTitle: { color: C.text, fontSize: 14, fontWeight: "800", marginBottom: 4 },
  announceBody: { color: C.sub, fontSize: 12 },

  emptyBox: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  emptyText: { color: C.sub },

  plansWrap: { paddingHorizontal: 12 },
  planCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  planName: { color: C.text, fontSize: 16, fontWeight: "800" },
  planPrice: { color: C.dim, fontSize: 22, fontWeight: "900", marginVertical: 2 },
  planDesc: { color: C.sub, marginBottom: 8 },
  planDivider: { height: 1, backgroundColor: "rgba(147,197,253,0.25)", marginVertical: 8 },
  planFeature: { color: C.sub, marginBottom: 4 },
});
