// src/components/AtribusiCuaca.tsx
import { Text, TouchableOpacity, Linking } from "react-native";
import { useAppTheme } from "../context/ThemeContext";

export default function AtribusiCuaca() {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL("https://open-meteo.com/")}
      style={{ paddingVertical: 12 }}
    >
      <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center" }}>
        Data cuaca & kualitas udara dari Open-Meteo
      </Text>
    </TouchableOpacity>
  );
}