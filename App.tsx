import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ThemeProvider } from "./src/contexts/themeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";

import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import MainTabs from "./src/screens/MainTabs";

const Stack = createNativeStackNavigator();


function RootNavigator() {
  const { isAllowed } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAllowed ? (
        // ANTES: <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MainScreen" component={MainTabs} />  // <-- TABS
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
