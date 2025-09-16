
import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setConfirm("");
      setSubmitting(false);
    }, [])
  );

  const handleRegister = async () => {
    try {
      const mail = email.trim();

      if (!mail || !password || !confirm) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }
      if (!mail.includes("@")) {
        Alert.alert("Error", "El correo no es válido");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (password !== confirm) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }

      setSubmitting(true);


      const cred = await auth().createUserWithEmailAndPassword(mail, password);


      // Navega al home principal
      navigation.replace("Home", { correo: cred.user.email });
    } catch (error: any) {
      console.log("Register error:", error?.code, error?.message);

      switch (error?.code) {
        case "auth/email-already-in-use":
          Alert.alert("Error", "Este correo ya está en uso");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "El correo no es válido");
          break;
        case "auth/weak-password":
          Alert.alert("Error", "La contraseña es muy débil");
          break;
        default:
          Alert.alert("Error", error?.message || "No se pudo registrar");
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => navigation.navigate("Login");

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={styles.logo} />

      <View style={styles.item}>
        <CustomInput title="Email" value={email} type="email" onChange={setEmail} />
      </View>

      <View style={styles.item}>
        <CustomInput title="Password" value={password} type="password" onChange={setPassword} />
      </View>

      <View style={styles.item}>
        <CustomInput title="Confirmar Password" value={confirm} type="password" onChange={setConfirm} />
      </View>

      <View style={styles.item}>
        <CustomButton title={submitting ? "Creando..." : "Crear cuenta"} onPress={handleRegister} disabled={submitting} />
      </View>

      <View style={styles.item}>
        <CustomButton title="Ya tengo cuenta" onPress={goToLogin} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f7f7f8" },
  logo: { width: 120, height: 120, marginBottom: 30 },
  item: { width: "100%", marginVertical: 5 },
});
