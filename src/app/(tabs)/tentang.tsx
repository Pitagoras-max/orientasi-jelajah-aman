// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang, gap: spacing.kecil }}>
      <Text
        style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
        accessibilityLabel="Judul Halaman Tentang Aplikasi Jelajah Aman"
      >
        Tentang Aplikasi
      </Text>
      <Text style={{ fontSize: typeScale.subjudul, fontWeight: "600" }}>
        Jelajah Aman
      </Text>
      <Text style={{ fontSize: typeScale.isi }}>Versi 1.0.0</Text>
      <Text style={{ fontSize: typeScale.keterangan, color: "#666" }}>
        Dibuat oleh: [ Risqi Agung Ganteng / 60324060]
      </Text>
    </SafeAreaView>
  );
}