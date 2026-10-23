// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilaiAwal?: string;
}

export default function SearchBox({ onCari, nilaiAwal = "" }: SearchBoxProps) {
  const { theme } = useAppTheme();
  const [teks, setTeks] = useState(nilaiAwal);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Ionicons name="search" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Cari nama kota (misal: Jakarta, Pekalongan)..."
        placeholderTextColor={theme.inputPlaceholder}
        value={teks}
        onChangeText={handleChange}
        style={{
          flex: 1,
          paddingVertical: 12,
          fontSize: 15,
          color: theme.inputText,
        }}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
      />
      {teks.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={theme.textSecondary}
          onPress={() => handleChange("")}
        />
      )}
    </View>
  );
}