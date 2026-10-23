// src/app/(tabs)/riwayat.tsx
import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ambilRiwayatPencarian,
  hapusItemRiwayat,
  bersihkanSemuaRiwayat,
} from "../../services/riwayatStorage";
import { hapusCacheKota, cekAdaCache } from "../../services/cacheRepository";
import { ItemRiwayatPencarian } from "../../types/riwayat";
import { useAppTheme } from "../../context/ThemeContext";

function formatWaktu(epoch: number): string {
  const selisihDetik = Math.floor((Date.now() - epoch) / 1000);
  if (selisihDetik < 60) return "Baru saja";
  const menit = Math.floor(selisihDetik / 60);
  if (menit < 60) return `${menit} menit yang lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam yang lalu`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari yang lalu`;
}

export default function TabRiwayat() {
  const { theme } = useAppTheme();
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayatPencarian[]>([]);
  const [statusCache, setStatusCache] = useState<Record<string, boolean>>({});
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanNotif, setPesanNotif] = useState<string | null>(null);

  const muatData = useCallback(async () => {
    setSedangMemuat(true);
    const data = await ambilRiwayatPencarian();
    setDaftarRiwayat(data);

    // Cek status cache untuk setiap item
    const statusMap: Record<string, boolean> = {};
    for (const item of data) {
      const kunci = `${item.latitude.toFixed(2)},${item.longitude.toFixed(2)}`;
      statusMap[kunci] = await cekAdaCache(item.latitude, item.longitude);
    }
    setStatusCache(statusMap);
    setSedangMemuat(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  function klikKota(kota: ItemRiwayatPencarian) {
    // Navigasi ke Beranda dan otomatis jalankan pencarian untuk kota tersebut
    router.push({
      pathname: "/",
      params: {
        pilihId: String(kota.id),
        pilihNama: kota.nama,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
      },
    });
  }

  function konfirmasiHapusCache(kota: ItemRiwayatPencarian) {
    const aksiHapusCache = async () => {
      await hapusCacheKota(kota.latitude, kota.longitude);
      const kunci = `${kota.latitude.toFixed(2)},${kota.longitude.toFixed(2)}`;
      setStatusCache((prev) => ({ ...prev, [kunci]: false }));
      setPesanNotif(`Cache cuaca untuk ${kota.nama} berhasil dihapus.`);
      setTimeout(() => setPesanNotif(null), 3000);
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(
        `Apakah Anda yakin ingin menghapus data cache cuaca untuk ${kota.nama}? Data offline kota ini akan dibuang.`
      );
      if (setuju) {
        aksiHapusCache();
      }
    } else {
      Alert.alert(
        "Konfirmasi Hapus Cache",
        `Apakah Anda yakin ingin menghapus data cache cuaca untuk ${kota.nama}? Data offline kota ini akan dibuang.`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus Cache",
            style: "destructive",
            onPress: aksiHapusCache,
          },
        ]
      );
    }
  }

  function konfirmasiHapusRiwayatItem(kota: ItemRiwayatPencarian) {
    const aksi = async () => {
      await hapusItemRiwayat(kota.nama, kota.id);
      setDaftarRiwayat((prev) => prev.filter((k) => k.timestamp !== kota.timestamp));
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm(`Hapus "${kota.nama}" dari riwayat pencarian?`);
      if (setuju) aksi();
    } else {
      Alert.alert("Hapus Riwayat", `Hapus "${kota.nama}" dari riwayat pencarian?`, [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: aksi },
      ]);
    }
  }

  function konfirmasiBersihkanSemua() {
    const aksi = async () => {
      await bersihkanSemuaRiwayat();
      setDaftarRiwayat([]);
    };

    if (Platform.OS === "web") {
      const setuju = window.confirm("Bersihkan semua riwayat pencarian?");
      if (setuju) aksi();
    } else {
      Alert.alert("Bersihkan Riwayat", "Bersihkan semua riwayat pencarian?", [
        { text: "Batal", style: "cancel" },
        { text: "Bersihkan Semua", style: "destructive", onPress: aksi },
      ]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.text }}>
              Riwayat Pencarian
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
              Maksimal 10 kota terakhir dicari
            </Text>
          </View>

          {daftarRiwayat.length > 0 && (
            <TouchableOpacity
              onPress={konfirmasiBersihkanSemua}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: theme.cardSecondary,
              }}
            >
              <Ionicons name="trash-outline" size={14} color={theme.textSecondary} />
              <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "600" }}>
                Bersihkan
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifikasi feedback */}
        {pesanNotif && (
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: theme.statusSegarBg,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.statusSegarText, fontWeight: "600" }}>
              {pesanNotif}
            </Text>
          </View>
        )}

        {/* Loading Indicator */}
        {sedangMemuat && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        )}

        {/* Empty State */}
        {!sedangMemuat && daftarRiwayat.length === 0 && (
          <View
            style={{
              padding: 32,
              borderRadius: 16,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              gap: 12,
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.cardSecondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="search-outline" size={30} color={theme.textSecondary} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.text,
                textAlign: "center",
              }}
            >
              Belum Ada Riwayat Pencarian
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Cari kota di tab Beranda. Setiap kota yang Anda telusuri akan otomatis tersimpan di sini (maks. 10 kota).
            </Text>
          </View>
        )}

        {/* List Riwayat */}
        {!sedangMemuat && daftarRiwayat.length > 0 && (
          <View style={{ gap: 10 }}>
            {daftarRiwayat.map((kota, index) => {
              const kunci = `${kota.latitude.toFixed(2)},${kota.longitude.toFixed(2)}`;
              const adaCache = statusCache[kunci] ?? false;

              return (
                <View
                  key={`${kota.id}-${kota.timestamp}-${index}`}
                  style={{
                    backgroundColor: theme.card,
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: theme.border,
                    gap: 10,
                  }}
                >
                  {/* Bagian atas: Klik kota untuk memicu pencarian cuaca */}
                  <TouchableOpacity
                    onPress={() => klikKota(kota)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: theme.primaryLight,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="location" size={20} color={theme.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: theme.text,
                          }}
                        >
                          {kota.nama}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 3,
                          }}
                        >
                          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                            {formatWaktu(kota.timestamp)}
                          </Text>
                          {adaCache && (
                            <View
                              style={{
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 4,
                                backgroundColor: theme.statusSegarBg,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: "700",
                                  color: theme.statusSegarText,
                                }}
                              >
                                Cache Offline Ada
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Panah indikator pencarian */}
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>

                  {/* Tombol aksi: Hapus Cache & Hapus Riwayat */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: theme.border,
                    }}
                  >
                    {/* Tombol Hapus Cache */}
                    {adaCache ? (
                      <TouchableOpacity
                        onPress={() => konfirmasiHapusCache(kota)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                          backgroundColor: theme.dangerLight,
                        }}
                      >
                        <Ionicons name="cloud-offline-outline" size={14} color={theme.danger} />
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.danger,
                            fontWeight: "600",
                          }}
                        >
                          Hapus Cache
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => konfirmasiHapusCache(kota)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          borderRadius: 6,
                          backgroundColor: theme.cardSecondary,
                        }}
                      >
                        <Ionicons name="trash-outline" size={13} color={theme.textSecondary} />
                        <Text
                          style={{
                            fontSize: 11,
                            color: theme.textSecondary,
                            fontWeight: "500",
                          }}
                        >
                          Bersihkan Cache
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Tombol Hapus Riwayat */}
                    <TouchableOpacity
                      onPress={() => konfirmasiHapusRiwayatItem(kota)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 6,
                        backgroundColor: theme.cardSecondary,
                      }}
                    >
                      <Ionicons name="close" size={14} color={theme.textSecondary} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        Hapus Riwayat
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}