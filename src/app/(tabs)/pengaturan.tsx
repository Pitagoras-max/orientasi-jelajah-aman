// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { bersihkanSemuaRiwayat } from "../../services/riwayatStorage";
import { useAppTheme, ThemeMode } from "../../context/ThemeContext";

export default function TabPengaturan() {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  function konfirmasiHapusSemuaCache() {
    const aksi = async () => {
      await hapusSemuaCache();
      setPesan("Seluruh data cache cuaca tersimpan telah dibersihkan.");
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(
        "Apakah Anda yakin ingin menghapus SELURUH data cache cuaca dari perangkat?"
      );
      if (setuju) aksi();
    } else {
      Alert.alert(
        "Konfirmasi Hapus Semua Cache",
        "Apakah Anda yakin ingin menghapus SELURUH data cache cuaca dari perangkat?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus Semua", style: "destructive", onPress: aksi },
        ]
      );
    }
  }

  function konfirmasiHapusRiwayat() {
    const aksi = async () => {
      await bersihkanSemuaRiwayat();
      setPesan("Seluruh riwayat pencarian telah dibersihkan.");
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(
        "Apakah Anda yakin ingin membersihkan seluruh riwayat pencarian?"
      );
      if (setuju) aksi();
    } else {
      Alert.alert(
        "Bersihkan Riwayat",
        "Apakah Anda yakin ingin membersihkan seluruh riwayat pencarian?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Bersihkan", style: "destructive", onPress: aksi },
        ]
      );
    }
  }

  const daftarMode: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap; deskripsi: string }[] = [
    {
      mode: "light",
      label: "Terang",
      icon: "sunny",
      deskripsi: "Tampilan cerah dengan latar putih bersih",
    },
    {
      mode: "dark",
      label: "Gelap",
      icon: "moon",
      deskripsi: "Tampilan gelap nyaman untuk mata di malam hari",
    },
    {
      mode: "system",
      label: "Ikuti Sistem",
      icon: "phone-portrait-outline",
      deskripsi: "Menyesuaikan otomatis dengan tema perangkat Anda",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* Header Section */}
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.text }}>
            Pengaturan Aplikasi
          </Text>
          <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>
            Sesuaikan preferensi tampilan dan kelola data penyimpanan
          </Text>
        </View>

        {/* Section: Tema Tampilan */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
            Tema Tampilan
          </Text>

          <View style={{ gap: 8 }}>
            {daftarMode.map((item) => {
              const aktif = themeMode === item.mode;
              return (
                <TouchableOpacity
                  key={item.mode}
                  onPress={() => setThemeMode(item.mode)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: aktif ? theme.primaryLight : theme.card,
                    borderWidth: 1.5,
                    borderColor: aktif ? theme.primary : theme.border,
                  }}
                  accessibilityLabel={`Pilih mode ${item.label}`}
                  accessibilityState={{ selected: aktif }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: aktif ? theme.primary : theme.cardSecondary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={aktif ? "#FFFFFF" : theme.text}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: aktif ? theme.primary : theme.text,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                        {item.deskripsi}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={aktif ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={aktif ? theme.primary : theme.textSecondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section: Manajemen Penyimpanan & Cache */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
            Manajemen Penyimpanan & Cache
          </Text>

          <View
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={konfirmasiHapusSemuaCache}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <View style={{ gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: theme.danger }}>
                  Hapus Seluruh Cache Cuaca
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                  Mengosongkan semua data cuaca offline di database lokal
                </Text>
              </View>
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: theme.border }} />

            <TouchableOpacity
              onPress={konfirmasiHapusRiwayat}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <View style={{ gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
                  Bersihkan Riwayat Pencarian
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                  Menghapus daftar pencarian kota terakhir
                </Text>
              </View>
              <Ionicons name="refresh-outline" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {pesan && (
          <View
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: theme.statusSegarBg,
            }}
          >
            <Text style={{ fontSize: 13, color: theme.statusSegarText, fontWeight: "600" }}>
              {pesan}
            </Text>
          </View>
        )}

        {/* Section: Info Aplikasi */}
        <View
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>
            Jelajah Aman
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            Aplikasi Informasi Cuaca & Kualitas Udara
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            Versi 1.0.0 (UTS Pemrograman Berbasis Platform)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}