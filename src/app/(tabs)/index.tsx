// src/app/index.tsx
import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import WeatherCard from "../../components/WeatherCard";
import SearchBox from "../../components/SearchBox";
import RiwayatList from "../../components/RiwayatList";
import IndikatorAQI from "../../components/IndikatorAQI";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("PEKALONGAN");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan", "SEMARANG"]);

  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    if (!kota.trim()) return;
    setKotaAktif(kota);
    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40, gap: 12 }}>
      {/* SearchBox sesuai Modul */}
      <SearchBox onCari={handleCari} />

      {/* Section 1: Cuaca */}
      <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 8 }}>Cuaca</Text>
      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />

      {/* Section 2: Laporan Kualitas Udara (Latihan Mandiri Modul) */}
      <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 8 }}>Laporan Kualitas Udara</Text>
      <IndikatorAQI 
        kota={kotaAktif} 
        indeksAQI={42} 
        tingkat="BAIK" 
        diperbaruiPada="2026-09-15 10:00" 
      />

      {/* Section 3: Riwayat Pencarian sesuai Modul */}
      <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 8 }}>Riwayat Pencarian</Text>
      <RiwayatList daftarKota={riwayat} />
    </ScrollView>
  );
}