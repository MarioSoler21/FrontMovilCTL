// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, Theme as NavTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ThemeProvider, useTheme } from "./src/contexts/themeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";

import Login from "./src/screens/Login";
import MainTabs from "./src/screens/MainTabs";
import Register from "./src/screens/Register";
import Subscribe from "./src/screens/Subscribe";
import CourseDetail from "./src/screens/CourseDetail"; // 👈 IMPORTA ESTO

export type RootStackParamList = {
  Login: { prefillEmail?: string } | undefined;
  RegisterScreen: { prefillEmail?: string } | undefined;
  MainScreen:
    | {
        initialTab?: "featured" | "search" | "learning" | "wishlist" | "account";
        correo?: string;
      }
    | undefined;
  Subscribe:
    | {
        planId: "basic" | "pro" | "premium";
        planName: string;
        price: string;
      }
    | undefined;
  CourseDetail:
    | {
        course: {
          id: string;
          title: string;
          provider: string;
          rating: number;
          reviews: number;
          price: string;
          tag?: "Nuevo" | "Pro" | "Premium";
          thumb?: any;
          category: string;
          youtubeId: string;
          preview: string;
        };
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isAllowed } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAllowed ? "MainScreen" : "Login"}
    >
      {/* Rutas públicas */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RegisterScreen" component={Register} />

      {/* Rutas comunes */}
      <Stack.Screen name="Subscribe" component={Subscribe} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} />

      {/* Rutas privadas */}
      <Stack.Screen name="MainScreen" component={MainTabs} />
    </Stack.Navigator>
  );
}


function AppNavigator() {
  const { theme } = useTheme();

  const navTheme: NavTheme = {
    dark: theme.isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
