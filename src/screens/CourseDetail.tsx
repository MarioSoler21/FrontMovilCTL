// src/screens/CourseDetail.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../contexts/themeContext";
import { useAuth } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CourseDetail">;

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

function makeStyles(c: Colors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    backTxt: { color: c.text, fontSize: 16 },
    thumbWrap: {
      margin: 12,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    thumb: { width: "100%", height: 200, backgroundColor: c.border },
    playOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    playBtn: {
      backgroundColor: "#00000088",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
    },
    playTxt: { color: "#fff", fontWeight: "800" },
    body: { paddingHorizontal: 16, gap: 10 },
    title: { color: c.text, fontSize: 20, fontWeight: "900" },
    meta: { color: c.subtitle },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: "#E9F5D0",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badgeTxt: { color: "#2E7D32", fontWeight: "700" },
    card: {
      marginTop: 10,
      backgroundColor: c.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 12,
      gap: 6,
    },
    sectionTitle: { color: c.text, fontWeight: "800", fontSize: 16 },
    desc: { color: c.subtitle, lineHeight: 20 },
    actions: { marginTop: 12, gap: 8 },
    warning: {
      marginTop: 8,
      color: c.subtitle,
    },
  });
}

export default function CourseDetail({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { isPro, isPremium } = useAuth();
  const styles = useMemo(() => makeStyles(theme.colors as Colors), [theme.colors]);

  const course = route.params?.course;
  if (!course) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backTxt}>← Atrás</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.title}>Curso no encontrado</Text>
          <Text style={styles.meta}>Vuelve e intenta de nuevo.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canWatch =
    isPremium || (isPro && course.tag !== "Premium") || (!course.tag && course.price.toLowerCase().includes("gratis"));

  const openYouTube = async () => {
    const url = `https://www.youtube.com/watch?v=${course.youtubeId}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error("No se puede abrir el enlace.");
      await Linking.openURL(url);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "No se pudo abrir el video.");
    }
  };

  const goToSubscribe = (planId: "pro" | "premium") =>
    navigation.navigate("Subscribe", {
      planId,
      planName: planId === "pro" ? "Pro" : "Premium",
      price: planId === "pro" ? "L 299" : "L 699",
    });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backTxt}>← Atrás</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail (YouTube) */}
        <View style={styles.thumbWrap}>
          <Image
            style={styles.thumb}
            resizeMode="cover"
            source={{ uri: `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg` }}
          />
          <View style={styles.playOverlay}>
            <TouchableOpacity style={styles.playBtn} onPress={canWatch ? openYouTube : undefined} activeOpacity={0.8}>
              <Text style={styles.playTxt}>{canWatch ? "▶ Ver video" : " Bloqueado"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.body}>
          {course.tag ? (
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{course.tag}</Text>
            </View>
          ) : null}
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.meta}>
            {course.provider} • {course.rating.toFixed(1)} ★ ({course.reviews.toLocaleString()}) • {course.category}
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.desc}>{course.preview}</Text>
          </View>

          <View style={styles.actions}>
            {canWatch ? (
              <CustomButton title="▶ Reproducir en YouTube" onPress={openYouTube} />
            ) : (
              <>
                <CustomButton title="Mejorar a Pro" onPress={() => goToSubscribe("pro")} />
                <CustomButton title="Mejorar a Premium" onPress={() => goToSubscribe("premium")} variant="secondary" />
                <Text style={styles.warning}>
                  Este contenido requiere un plan superior. Actualiza tu plan para verlo.
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
