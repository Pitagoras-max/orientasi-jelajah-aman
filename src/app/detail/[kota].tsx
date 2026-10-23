// src/app/detail/[kota].tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import WeatherCard from "../../components/WeatherCard";
import { useAppTheme } from "../../context/ThemeContext";

export default function HalamanDetail() {
  const { theme } = useAppTheme();
  const { kota } = useLocalSearchParams<{ kota: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16, gap: 16 }}>
      <WeatherCard kota={kota ?? "Kota"} suhu={29} tingkatAQI="BAIK" indeksAQI={35} />

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/tambah-favorit",
            params: {
              id: "0",
              nama: kota ?? "",
              lat: "-6.2",
              lon: "106.8",
            },
          })
        }
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          paddingVertical: 14,
          borderRadius: 12,
          backgroundColor: theme.primary,
        }}
      >
        <Ionicons name="heart" size={18} color="#FFFFFF" />
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>
          Tambahkan ke Favorit
        </Text>
      </TouchableOpacity>
    </View>
  );
}