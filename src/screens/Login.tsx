// src/screens/Login.tsx
import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // lo mantenemos para UI, pero no se manda a Firebase

  const { login } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
    }, [])
  );

  const handleLogin = () => {
    const mail = email.trim();
    if (!mail || !password.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }
    if (!mail.includes("@")) {
      Alert.alert("Error", "El correo no es válido");
      return;
    }

    // ✅ Login local (sin Firebase): guarda el usuario en el contexto
    login(mail);

    // Ir al Home
    navigation.replace("MainScreen", { correo: mail });
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={styles.logo}
      />

      <View style={styles.item}>
        <CustomInput
          title="Email"
          value={email}
          type="email"
          onChange={setEmail}
        />
      </View>

      <View style={styles.item}>
        <CustomInput
          title="Password"
          value={password}
          type="password"
          onChange={setPassword}
        />
      </View>

      <View style={styles.item}>
        <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
      </View>

      <View style={styles.item}>
        <CustomButton
          title="Registrar"
          onPress={handleRegister}
          variant="secondary"
        />
      </View>

      <View style={styles.item}>
        <CustomButton
          title="Cambiar contraseña"
          onPress={() => {}}
          variant="tertiary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f7f7f8" },
  logo: { width: 120, height: 120, marginBottom: 30 },
  item: { width: "100%", marginVertical: 5 },
});
