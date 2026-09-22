import { View, Text } from "react-native";
import { WeatherCardProps } from "../../types/cuaca";

// 1. Baris import untuk memanggil variabel dari styles.ts
import { typeScale, spacing } from "../constants/styles";

export default function WeatherCard({ kota, suhu, tingkatAQI }: WeatherCardProps) {
  const warnaAQI = tingkatAQI === "BAIK" ? "green" : "orange";

  return (
    // 2. Menggunakan spacing.sedang
    <View style={{ padding: spacing.sedang, borderRadius: 8, backgroundColor: "#F4F7FA" }}>
      {/* 3. Menggunakan typeScale */}
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul }}>{kota}</Text>
      <Text style={{ fontSize: 32 }}>{suhu}°C</Text>
      <Text style={{ color: warnaAQI, fontSize: typeScale.isi }}>AQI: {tingkatAQI}</Text>
    </View>
  );
}