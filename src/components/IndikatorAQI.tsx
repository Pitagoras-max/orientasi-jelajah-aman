// components/IndikatorAQI.tsx
import { View, Text } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  let warna = "green";
  if (tingkat === "SEDANG") warna = "orange";
  else if (tingkat === "TIDAK_SEHAT") warna = "red";
  else if (tingkat === "BERBAHAYA") warna = "purple";

  return (
    <View style={{ padding: 16, borderRadius: 8, backgroundColor: "#F4F7FA", gap: 4 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{kota}</Text>
      <Text style={{ fontSize: 32 }}>{indeksAQI}</Text>
      <Text style={{ color: warna, fontWeight: "bold" }}>{tingkat}</Text>
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "gray" }}>Diperbarui: {diperbaruiPada}</Text>
      )}
    </View>
  );
}