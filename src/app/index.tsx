// src/app/index.tsx
import { View } from "react-native";
import { useState, useEffect } from "react";
import WeatherCard from "../components/WeatherCard";
import SearchBox from "../components/SearchBox";
import RiwayatList from "../components/RiwayatList";
import IndikatorAQI from "../components/IndikatorAQI";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  // useEffect untuk mencatat perubahan kota aktif
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
    <View style={{ padding: 16, gap: 16 }}>
      {/* Input Pencarian */}
      <SearchBox onCari={handleCari} />

      {/* Kartu Cuaca utama */}
      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />

      {/* Keterangan Cuaca / Laporan Udara (Tahap 5) */}
      <IndikatorAQI 
        kota={kotaAktif} 
        indeksAQI={45} 
        tingkat="BAIK" 
        diperbaruiPada="10:00 WIB" 
      />

      {/* Komponen Riwayat Pencarian Kota */}
      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}