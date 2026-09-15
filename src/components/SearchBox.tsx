// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

interface SearchBoxProps {
  onCari: (kota: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");

  const handlePress = () => {
    onCari(teks);
    setTeks("");
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <TextInput
        placeholder="kota"
        value={teks}
        onChangeText={setTeks}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#7C7C7C",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 2,
          backgroundColor: "#FFFFFF",
          fontSize: 16,
        }}
      />
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: "#2196F3",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 2,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 14 }}>CARI</Text>
      </TouchableOpacity>
    </View>
  );
}