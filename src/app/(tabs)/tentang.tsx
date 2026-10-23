// src/app/(tabs)/tentang.tsx
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../context/ThemeContext";

export default function TabTentang() {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header Hero Card */}
        <View
          style={{
            alignItems: "center",
            padding: 24,
            borderRadius: 16,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: theme.primaryLight,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="cloudy" size={38} color={theme.primary} />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.text,
            }}
            accessibilityLabel="Judul Halaman Tentang Aplikasi Jelajah Aman"
          >
            Jelajah Aman
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.textSecondary,
              textAlign: "center",
            }}
          >
            Aplikasi Pemantau Cuaca & Kualitas Udara Ramah Pengguna
          </Text>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: theme.cardSecondary,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: theme.textSecondary }}>
              Versi 1.0.0 (UTS Edition)
            </Text>
          </View>
        </View>

        {/* Informasi Pengembang */}
        <View
          style={{
            padding: 16,
            borderRadius: 14,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
            Informasi Mahasiswa
          </Text>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>Nama:</Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: theme.text }}>
                Risqi Agung
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>NIM:</Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: theme.text }}>
                60324060
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>Mata Kuliah:</Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: theme.text }}>
                Pemrograman Berbasis Platform
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>Program Studi:</Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: theme.text }}>
                S1 Informatika UIN K.H. Abdurrahman Wahid
              </Text>
            </View>
          </View>
        </View>

        {/* Fitur Utama */}
        <View
          style={{
            padding: 16,
            borderRadius: 14,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
            Fitur Utama Aplikasi
          </Text>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Text style={{ fontSize: 13, color: theme.text }}>
                Pencarian cuaca & indeks AQI real-time
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Text style={{ fontSize: 13, color: theme.text }}>
                Penyimpanan offline-first dengan SQLite
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Text style={{ fontSize: 13, color: theme.text }}>
                Riwayat pencarian terakhir (maks. 10 kota)
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Text style={{ fontSize: 13, color: theme.text }}>
                Penghapusan cache dengan konfirmasi dialog
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Text style={{ fontSize: 13, color: theme.text }}>
                Tema Gelap, Terang, dan Ikuti Sistem
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}