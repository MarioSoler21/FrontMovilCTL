// src/screens/Search.tsx
import React, { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { useTheme } from "../contexts/themeContext";

export default function Search() {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const [query, setQuery] = useState("");

  // Mock de resultados
  const results = [
    { id: "1", title: "Curso de Excel Financiero" },
    { id: "2", title: "Declaración Mensual SAR" },
    { id: "3", title: "Auditoría Fiscal aplicada" },
  ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.root}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar cursos, temas o categorías…"
        placeholderTextColor={theme.colors.placeholder}
        style={styles.searchInput}
      />
      {results.length ? (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Text style={styles.resultItem}>{item.title}</Text>
          )}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTxt}>No hay resultados</Text>
        </View>
      )}
    </View>
  );
}

const makeStyles = (c: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background, padding: 16 },
    searchInput: {
      backgroundColor: c.inputBg,
      color: c.inputText,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 16,
    },
    resultsList: { gap: 12 },
    resultItem: { color: c.text, fontSize: 16 },
    emptyBox: {
      marginTop: 20,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
    },
    emptyTxt: { color: c.subtitle },
  });
