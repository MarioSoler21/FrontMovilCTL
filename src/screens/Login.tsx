import { Alert, Button, StyleSheet, Text, View, ImageBackground } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { i18n, useLanguage } from "../contexts/LanguageContext";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // extra para feedback visual

  const { login, isAllowed } = useAuth();

  const handleOnChangeEmail = (val: string) => setEmail(val);
  const handleOnChangePassword = (val: string) => setPassword(val);

  const handleLogin = () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Por favor complete todos los campos");
        Alert.alert("Error", "Por favor complete todos los campos");
        return;
      }
      if (!email.includes("@")) {
        setError("Correo inválido");
        return;
      }
      // navegación + auth (igual que tu flujo actual)
      login(email);
      navigation.navigate("HomeScreen", { correo: email });
    } catch (e) {
      setError("Error al iniciar sesión");
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder para la demo (si luego integrás Supabase/Expo Auth, lo conectás aquí)
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
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.backgroundCard}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <View style={styles.spacing}>
            <CustomInput
              type="email"
              value={email}
              title={"Correo"}
              onChange={handleOnChangeEmail}
            />
          </View>

          <View style={styles.spacing}>
            <CustomInput
              type="password"
              value={password}
              title={"Contraseña"}
              onChange={handleOnChangePassword}
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton title={i18n.t("signIn")} onPress={handleLogin} />

          <View style={{ height: 12 }} />

          {/* Botón estilo "outline/light" usando tu variant secondary */}
          <CustomButton
            title="Iniciar sesión con Google"
            onPress={handleGoogleLogin}
            variant={"secondary"}
          />

          <View style={{ height: 12 }} />
          <CustomButton title={i18n.t("signUp")} onPress={() => {}} variant={"secondary"} />
          <View style={{ height: 8 }} />
          <CustomButton title={i18n.t("forgotPassword")} onPress={() => {}} variant={"tertiary"} />

          <Text style={styles.footerText}>
            ¿No tienes una cuenta? Regístrate
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)", // capa oscura como en el web
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backgroundCard: {
    width: "88%",
    maxWidth: 500,
    backgroundColor: "rgba(20,20,28,0.92)", // “bg-dark”
    borderRadius: 16,
    padding: 24,
    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // sombra Android
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  spacing: {
    marginBottom: 12,
  },
  errorText: {
    color: "#ffb4b4",
    marginBottom: 10,
    textAlign: "center",
  },
  footerText: {
    color: "#d0d0d0",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
  },
});
