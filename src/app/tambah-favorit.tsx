// src/app/tambah-favorit.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { tambahFavorit } from "../services/favoritStorage";
import { useAppTheme } from "../context/ThemeContext";

export default function ModalTambahFavorit() {
  const { theme } = useAppTheme();
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      name: nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 24,
          borderWidth: 1,
          borderColor: theme.border,
          alignItems: "center",
          gap: 16,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#FEE2E2",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="heart" size={32} color="#EF4444" />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text,
            textAlign: "center",
          }}
        >
          Tambah ke Favorit?
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Simpan <Text style={{ fontWeight: "700", color: theme.text }}>{nama}</Text> ke daftar
          kota favorit Anda untuk akses cepat di kemudian hari.
        </Text>

        <View style={{ flexDirection: "row", gap: 12, width: "100%", marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: theme.cardSecondary,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
              Batal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={simpan}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: theme.primary,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}