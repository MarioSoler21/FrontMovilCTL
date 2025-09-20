// src/screens/Wishlist.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/themeContext";

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

export default function Wishlist() {
  const { theme } = useTheme();
  const s = useMemo(() => makeStyles(theme.colors as Colors), [theme.colors]);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Encabezado */}
      <View style={s.hero}>
        <Text style={s.kicker}>Acerca de CTL</Text>
        <Text style={s.title}>Formamos profesionales en fiscalidad y operaciones</Text>
        <Text style={s.sub}>
          Somos una academia/práctica que combina consultoría y educación. Nuestra misión es
          simplificar lo complejo y llevar a las empresas a operar con cumplimiento y eficiencia.
        </Text>
      </View>

      {/* Tarjetas principales */}
      <View style={s.grid}>
        <Card>
          <Text style={s.cardTitle}>Misión</Text>
          <Text style={s.cardBody}>
            Democratizar el conocimiento fiscal y operativo con cursos prácticos, plantillas y
            acompañamiento cercano.
          </Text>
        </Card>

        <Card>
          <Text style={s.cardTitle}>Visión</Text>
          <Text style={s.cardBody}>
            Ser la plataforma líder en Honduras y Centroamérica para capacitar equipos de finanzas,
            auditoría y comercio exterior.
          </Text>
        </Card>

        <Card>
          <Text style={s.cardTitle}>Valores</Text>
          <PillRow items={["Claridad", "Rigor", "Practicidad", "Ética"]} />
        </Card>
      </View>

      {/* Por qué CTL */}
      <View style={s.block}>
        <Text style={s.blockTitle}>¿Por qué elegir CTL?</Text>
        <View style={s.list}>
          <Bullet text="Contenido 100% aplicado a la realidad local (SAR, SPS, Aduanas)." />
          <Bullet text="Casos reales, checklists y plantillas descargables." />
          <Bullet text="Soporte por WhatsApp para planes Pro y Premium." />
          <Bullet text="Actualizaciones mensuales con cambios normativos." />
        </View>
      </View>

      {/* Equipo (mock) */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Nuestro equipo</Text>
        <View style={s.teamRow}>
          <Member initials="MS" name="Mario Soler" role="Director • Auditoría & Fiscalidad" />
          <Member initials="AC" name="Ana Cruz" role="Consultora • Comercio Exterior" />
          <Member initials="JG" name="Juan Gómez" role="Analista • Data & Excel Financiero" />
        </View>
      </View>

      {/* CTA */}
      <View style={s.cta}>
        <Text style={s.ctaTitle}>¿Tienes dudas o necesitas una demo?</Text>
        <Text style={s.ctaSub}>Conversemos 15 minutos y te mostramos cómo usar la plataforma.</Text>
        <TouchableOpacity style={s.btnPrimary} activeOpacity={0.9} onPress={() => {}}>
          <Text style={s.btnPrimaryTxt}>Escríbenos</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 18 }} />
      <Text style={s.footNote}>CTL • Capacitación y Consultoría</Text>
      <View style={{ height: 8 }} />
    </ScrollView>
  );
}

/* ---------- UI helpers ---------- */
function Card({ children }: { children: React.ReactNode }) {
  return <View style={{ padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#2a2f36", backgroundColor: "transparent", gap: 8 }}>{children}</View>;
}
function Pill({ text }: { text: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: "#3a4250", backgroundColor: "#3a425020" }}>
      <Text style={{ color: "#E8EAED", fontWeight: "700", fontSize: 12 }}>{text}</Text>
    </View>
  );
}
function PillRow({ items }: { items: string[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((t) => (
        <Pill key={t} text={t} />
      ))}
    </View>
  );
}
function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Text style={{ color: "#8ab4f8", marginTop: 1 }}>•</Text>
      <Text style={{ color: "#9BA1A6", flex: 1 }}>{text}</Text>
    </View>
  );
}
function Member({ initials, name, role }: { initials: string; name: string; role: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center", paddingVertical: 8 }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 1,
          borderColor: "#4f5b62",
          backgroundColor: "#4f5b6222",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#E8EAED", fontWeight: "900" }}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#E8EAED", fontWeight: "800" }}>{name}</Text>
        <Text style={{ color: "#9BA1A6", fontSize: 12 }}>{role}</Text>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const makeStyles = (c: Colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    content: { padding: 16, gap: 12 },

    hero: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    kicker: { color: c.subtitle, fontWeight: "700", letterSpacing: 0.5 },
    title: { color: c.text, fontSize: 20, fontWeight: "900" },
    sub: { color: c.subtitle },

    grid: { gap: 12 },

    cardTitle: { color: c.text, fontWeight: "800", fontSize: 16 },
    cardBody: { color: c.subtitle },

    block: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      gap: 10,
    },
    blockTitle: { color: c.text, fontWeight: "800", fontSize: 16 },
    list: { gap: 8 },

    teamRow: { marginTop: 4 },

    cta: {
      alignItems: "center",
      gap: 8,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.primary,
      backgroundColor: c.primary + "13",
    },
    ctaTitle: { color: c.text, fontWeight: "900", fontSize: 16, textAlign: "center" },
    ctaSub: { color: c.subtitle, textAlign: "center" },

    btnPrimary: {
      marginTop: 4,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
    btnPrimaryTxt: { color: c.buttonText, fontWeight: "800" },

    footNote: { color: c.subtitle, textAlign: "center", fontSize: 12 },
  });
