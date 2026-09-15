// components/IndikatorAQI.tsx
import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  // Menentukan warna berdasarkan tingkat kualitas udara
  let warna = "green";
  if (tingkat === "SEDANG") warna = "orange";
  else if (tingkat === "TIDAK_SEHAT") warna = "red";
  else if (tingkat === "BERBAHAYA") warna = "purple";

  return (
    <View style={{ padding: 16, borderRadius: 8, borderWidth: 1, borderColor: warna, gap: 4 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>Laporan Udara: {kota}</Text>
      <Text style={{ color: warna, fontWeight: "bold" }}>
        Status: {tingkat} (AQI: {indeksAQI})
      </Text>
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "gray" }}>Diperbarui: {diperbaruiPada}</Text>
      )}
    </View>
  );
}