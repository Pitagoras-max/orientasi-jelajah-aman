// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { ambilCuacaOfflineFirst, BATAS_CACHE_MS } from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import { mintaIzinLokasi, ambilKoordinatSaatIni } from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { simpanRiwayatPencarian } from "../../services/riwayatStorage";
import { HasilGeocoding } from "../../types/geocoding";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { useAppTheme } from "../../context/ThemeContext";

export default function HalamanUtama() {
  const { theme } = useAppTheme();
  const searchParams = useLocalSearchParams<{
    pilihId?: string;
    pilihNama?: string;
    lat?: string;
    lon?: string;
  }>();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [pesanFeedback, setPesanFeedback] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);
  const lastParamRef = useRef<string | null>(null);

  async function muatKotaTersimpan() {
    try {
      const data = await daftarKotaTersimpan();
      setKotaTersimpan(data);
    } catch {
      // fallback
    }
  }

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  // Debounce pencarian kota
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  // Pilih kota dan ambil cuaca offline-first
  const pilihKota = useCallback(
    async (kota: HasilGeocoding, paksaPerbarui = false) => {
      setKotaTerpilih(kota);
      setHasilPencarian([]); // sembunyikan dropdown pencarian setelah dipilih
      const idSaatIni = ++requestIdRef.current;
      setSedangMemuat(true);
      setPesanError(null);

      // Simpan ke riwayat pencarian (Fitur 2 UTS)
      if (kota.name && kota.name !== "Lokasi Saat Ini") {
        simpanRiwayatPencarian({
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
          country: kota.country ?? "",
        }).catch(() => {});
      }

      try {
        const data = await ambilCuacaOfflineFirst(
          {
            id: kota.id,
            nama: kota.name,
            latitude: kota.latitude,
            longitude: kota.longitude,
          },
          { paksaPerbarui }
        );

        if (idSaatIni !== requestIdRef.current) return;
        setHasil(data);
        muatKotaTersimpan();
      } catch {
        if (idSaatIni !== requestIdRef.current) return;
        setHasil(null);
        setPesanError(
          "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
        );
      } finally {
        if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
      }
    },
    []
  );

  // Tangani navigasi dari tab Riwayat atau Favorit
  useEffect(() => {
    if (searchParams?.pilihNama && searchParams?.lat && searchParams?.lon) {
      const paramKey = `${searchParams.pilihNama}-${searchParams.lat}-${searchParams.lon}`;
      if (lastParamRef.current !== paramKey) {
        lastParamRef.current = paramKey;
        pilihKota({
          id: searchParams.pilihId ? Number(searchParams.pilihId) : -1,
          name: searchParams.pilihNama,
          latitude: Number(searchParams.lat),
          longitude: Number(searchParams.lon),
          country: "",
        });
      }
    }
  }, [searchParams, pilihKota]);

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi("Izin lokasi ditolak. Silakan cari kota secara manual di atas.");
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }
    setPesanLokasi(null);
    try {
      const koordinat = await ambilKoordinatSaatIni();
      pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      });
    } catch {
      setPesanLokasi("Gagal mendeteksi lokasi saat ini.");
    }
  }

  // Fitur 3: Konfirmasi dan Hapus Cache Kota
  function konfirmasiHapusCache(k: RingkasanKotaTersimpan) {
    const aksiHapus = async () => {
      await hapusCacheKota(k.latitude, k.longitude);
      await muatKotaTersimpan();

      // Jika kota yang sedang aktif dihapus cachenya, perbarui status jika perlu
      setPesanFeedback(`Data cache untuk ${k.nama} berhasil dihapus.`);
      setTimeout(() => setPesanFeedback(null), 3000);
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(
        `Apakah Anda yakin ingin menghapus data cache cuaca untuk ${k.nama}? Data offline kota ini akan dibuang.`
      );
      if (setuju) aksiHapus();
    } else {
      Alert.alert(
        "Konfirmasi Hapus Cache",
        `Apakah Anda yakin ingin menghapus data cache cuaca untuk ${k.nama}? Data offline kota ini akan dibuang.`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus Cache", style: "destructive", onPress: aksiHapus },
        ]
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Input Box */}
        <SearchBox onCari={setTeksCari} />

        {/* Tombol Gunakan Lokasi Saat Ini */}
        <TouchableOpacity
          onPress={gunakanLokasiSaatIni}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: theme.primaryLight,
            borderWidth: 1,
            borderColor: theme.primary,
          }}
        >
          <Ionicons name="navigate" size={18} color={theme.primary} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: theme.primary }}>
            Gunakan Lokasi Saat Ini
          </Text>
        </TouchableOpacity>

        {pesanLokasi && (
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: theme.cardSecondary,
            }}
          >
            <Text
              style={{ fontSize: 12, color: theme.danger }}
              accessibilityLabel={pesanLokasi}
            >
              {pesanLokasi}
            </Text>
          </View>
        )}

        {/* Feedback Notifikasi */}
        {pesanFeedback && (
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: theme.statusSegarBg,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.statusSegarText, fontWeight: "600" }}>
              {pesanFeedback}
            </Text>
          </View>
        )}

        {/* Dropdown Hasil Pencarian Geocoding */}
        {hasilPencarian.length > 0 && (
          <View
            style={{
              borderRadius: 12,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: "hidden",
            }}
          >
            {hasilPencarian.map((kota, idx) => (
              <TouchableOpacity
                key={`${kota.id}-${idx}`}
                onPress={() => pilihKota(kota)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 14,
                  borderBottomWidth: idx < hasilPencarian.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>
                    {kota.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                    {[kota.admin1, kota.country].filter(Boolean).join(", ")}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={theme.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Section: Tersimpan di Perangkat (Bisa Dibuka Offline) */}
        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="cloud-offline" size={16} color={theme.primary} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>
                Tersimpan di perangkat (bisa dibuka offline)
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              {kotaTersimpan.map((k) => (
                <View
                  key={k.kunci}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      pilihKota({
                        id: k.id,
                        name: k.nama,
                        latitude: k.latitude,
                        longitude: k.longitude,
                        country: "",
                      })
                    }
                    style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}
                  >
                    <Ionicons name="location-outline" size={18} color={theme.primary} />
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
                        {k.nama}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                        Ketuk untuk muat offline
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Tombol Hapus Cache per-item */}
                  <TouchableOpacity
                    onPress={() => konfirmasiHapusCache(k)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                      borderRadius: 6,
                      backgroundColor: theme.dangerLight,
                    }}
                    accessibilityLabel={`Hapus cache cuaca untuk ${k.nama}`}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                    <Text style={{ fontSize: 11, color: theme.danger, fontWeight: "600" }}>
                      Hapus Cache
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Loading Indicator */}
        {sedangMemuat && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {/* Error Message */}
        {pesanError && (
          <View
            style={{
              padding: 14,
              borderRadius: 12,
              backgroundColor: theme.dangerLight,
              borderWidth: 1,
              borderColor: theme.danger,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="alert-circle" size={20} color={theme.danger} />
              <Text
                style={{ fontSize: 13, color: theme.danger, flex: 1, fontWeight: "500" }}
                accessibilityLabel={pesanError}
              >
                {pesanError}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: theme.danger,
              }}
            >
              <Text style={{ fontSize: 12, color: "#FFFFFF", fontWeight: "700" }}>
                Coba Lagi
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tampilan Hasil Cuaca */}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <View style={{ gap: 12 }}>
            <StatusData sumber={hasil.sumber} disimpanPada={hasil.disimpanPada} />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
              indeksAQI={hasil.kualitasUdara.indeksAQI}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderRadius: 10,
                backgroundColor: theme.cardSecondary,
                gap: 8,
              }}
            >
              <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
              <Text style={{ fontSize: 13, color: theme.textSecondary, flex: 1 }}>
                Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)} {"\u2022"} Angin{" "}
                {hasil.cuaca.saatIni.kecepatanAngin} km/j
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => pilihKota(kotaTerpilih, true)}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: theme.cardSecondary,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Ionicons name="refresh" size={16} color={theme.text} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
                  Perbarui
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/tambah-favorit",
                    params: {
                      id: String(kotaTerpilih.id),
                      nama: kotaTerpilih.name,
                      lat: String(kotaTerpilih.latitude),
                      lon: String(kotaTerpilih.longitude),
                    },
                  })
                }
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: theme.primary,
                }}
              >
                <Ionicons name="heart" size={16} color="#FFFFFF" />
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
                  Ke Favorit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}