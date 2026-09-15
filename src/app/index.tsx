// src/app/index.tsx
import { View } from "react-native";
import { useState, useEffect } from "react";
import WeatherCard from "../components/WeatherCard";
import SearchBox from "../components/SearchBox";
import RiwayatList from "../components/RiwayatList";
import IndikatorAQI from "../components/IndikatorAQI"; // 1. Import komponen baru

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);
    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <SearchBox onCari={handleCari} />
      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />
      
      {/* 2. Tambahkan IndikatorAQI untuk Latihan Mandiri */}
      <IndikatorAQI 
        kota={kotaAktif} 
        indeksAQI={45} 
        tingkat="BAIK" 
        diperbaruiPada="10:00 WIB" 
      />

      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}