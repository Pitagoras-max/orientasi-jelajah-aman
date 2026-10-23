// src/components/StatusData.tsx
import { View, Text } from "react-native";
import { SumberData } from "../types/cache";
import { useAppTheme } from "../context/ThemeContext";

interface StatusDataProps {
  sumber: SumberData;
  disimpanPada: number;
}

function formatUmur(disimpanPada: number): string {
  const menit = Math.floor((Date.now() - disimpanPada) / 60000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return menit + " menit lalu";
  const jam = Math.floor(menit / 60);
  if (jam < 24) return jam + " jam lalu";
  return Math.floor(jam / 24) + " hari lalu";
}

function labelSumber(sumber: SumberData): string {
  if (sumber === "jaringan") return "Data terbaru dari internet";
  if (sumber === "cache-segar") return "Data tersimpan (masih segar)";
  return "Mode offline - data tersimpan mungkin sudah usang";
}

export default function StatusData({ sumber, disimpanPada }: StatusDataProps) {
  const { theme } = useAppTheme();
  const basi = sumber === "cache-basi";
  const label = labelSumber(sumber);
  const umur = formatUmur(disimpanPada);

  const bgWarna = basi ? theme.statusBasiBg : theme.statusSegarBg;
  const teksWarna = basi ? theme.statusBasiText : theme.statusSegarText;

  return (
    <View
      accessible
      accessibilityLabel={label + ", diperbarui " + umur}
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: bgWarna,
        gap: 2,
      }}
    >
      <Text style={{ fontSize: 13, color: teksWarna, fontWeight: "700" }}>{label}</Text>
      <Text style={{ fontSize: 11, color: teksWarna, opacity: 0.85 }}>Diperbarui {umur}</Text>
    </View>
  );
}