import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View, ImageBackground } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useAuth } from "../contexts/AuthContext";
import { i18n } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/themeContext";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { theme } = useTheme();

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      const msg = "Por favor complete todos los campos";
      setError(msg);
      Alert.alert("Error", msg);
      return;
    }

    if (!email.includes("@")) {
      const msg = i18n.t("invalidEmail");
      setError(msg);
      Alert.alert("Error", msg);
      return;
    }

    // Autentica y ve a la pantalla principal con tabs
    login(email); // <- Tipado correcto (string)
    navigation.replace("MainScreen", { initialTab: "learning", correo: email });
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google", "Login con Google (demo)");
  };

  return (
    <ImageBackground
      source={{
        uri:
          "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1950&q=80",
      }}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: theme.isDark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)" }]} />
      <View style={styles.container}>
        <View style={[styles.backgroundCard, { backgroundColor: theme.isDark ? "rgba(20,20,28,0.92)" : "rgba(255,255,255,0.92)", borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {i18n.t("signIn")}
          </Text>

          <View style={styles.spacing}>
            <CustomInput
              type="email"
              value={email}
              title="Correo"
              onChange={setEmail}
            />
          </View>

          <View style={styles.spacing}>
            <CustomInput
              type="password"
              value={password}
              title="Contraseña"
              onChange={setPassword}
            />
          </View>

          {!!error && <Text style={[styles.errorText, { color: theme.isDark ? "#ffb4b4" : "#b91c1c" }]}>{error}</Text>}

          <CustomButton title={i18n.t("signIn")} onPress={handleLogin} />

          <View style={{ height: 12 }} />
          <CustomButton
            title="Iniciar sesión con Google"
            onPress={handleGoogleLogin}
            variant="secondary"
          />

          <View style={{ height: 12 }} />
          <CustomButton title={i18n.t("signUp")} onPress={() => {}} variant="secondary" />
          <View style={{ height: 8 }} />
          <CustomButton title={i18n.t("forgotPassword")} onPress={() => {}} variant="tertiary" />

          <Text style={[styles.footerText, { color: theme.colors.subtitle }]}>
            ¿No tienes una cuenta? Regístrate
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

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
    bgImage: { flex: 1, width: "100%", height: "100%" },
    overlay: { ...StyleSheet.absoluteFillObject },
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
    backgroundCard: {
      width: "88%",
      maxWidth: 500,
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
    },
    title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 16 },
    spacing: { marginBottom: 12 },
    errorText: { marginBottom: 10, textAlign: "center" },
    footerText: { textAlign: "center", marginTop: 10, fontSize: 12 },
  });
