// app/(tabs)/favorit.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import RiwayatList from "../../components/RiwayatList";

export default function TabFavorit() {
  // Data dummy daftar kota favorit
  const daftarFavorit = ["Pekalongan", "Bandung", "Yogyakarta"];

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Daftar Kota Favorit
      </Text>
      <RiwayatList daftarKota={daftarFavorit} />
    </SafeAreaView>
  );
}