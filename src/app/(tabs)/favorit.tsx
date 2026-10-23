// src/app/(tabs)/favorit.tsx
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";
import { useAppTheme } from "../../context/ThemeContext";

export default function TabFavorit() {
  const { theme } = useAppTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, [])
  );

  function konfirmasiHapus(id: number, nama: string) {
    const aksi = async () => {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(`Apakah Anda yakin ingin menghapus ${nama} dari daftar favorit?`);
      if (setuju) aksi();
    } else {
      Alert.alert(
        "Konfirmasi Hapus",
        `Apakah Anda yakin ingin menghapus ${nama} dari daftar favorit?`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: aksi },
        ]
      );
    }
  }

  function klikKota(kota: KotaFavorit) {
    router.push({
      pathname: "/",
      params: {
        pilihId: String(kota.id),
        pilihNama: kota.name,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
      },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header Section */}
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.text }}>
            Kota Favorit
          </Text>
          <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
            Tersimpan {daftarFavorit.length} kota pilihan Anda
          </Text>
        </View>

        {/* Empty State */}
        {daftarFavorit.length === 0 && (
          <View
            style={{
              padding: 32,
              borderRadius: 16,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              gap: 12,
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.cardSecondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="heart-outline" size={30} color={theme.textSecondary} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.text,
                textAlign: "center",
              }}
            >
              Belum Ada Kota Favorit
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Cari kota di Beranda dan ketuk tombol "Tambahkan ke Favorit" untuk menyimpannya ke sini.
            </Text>
          </View>
        )}

        {/* List Favorit */}
        {daftarFavorit.length > 0 && (
          <View style={{ gap: 10 }}>
            {daftarFavorit.map((kota) => (
              <View
                key={kota.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: theme.card,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <TouchableOpacity
                  onPress={() => klikKota(kota)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#FEE2E2",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="heart" size={20} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: theme.text,
                      }}
                    >
                      {kota.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                      Ketuk untuk melihat cuaca
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => konfirmasiHapus(kota.id, kota.name)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: theme.cardSecondary,
                  }}
                  accessibilityLabel={`Hapus ${kota.name} dari favorit`}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}