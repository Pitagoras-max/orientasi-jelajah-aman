// src/components/RiwayatList.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

interface RiwayatListProps {
  daftarKota: string[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: 8 }}>
      {daftarKota.map((kota) => (
        <Link
          key={kota}
          href={{ pathname: "/detail/[kota]", params: { kota } }}
          asChild
        >
          <TouchableOpacity
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="location-outline" size={18} color={theme.primary} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>
                {kota}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}
