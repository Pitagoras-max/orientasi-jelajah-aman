// src/services/riwayatStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemRiwayatPencarian } from "../types/riwayat";

const KUNCI_RIWAYAT = "@jelajah-aman:riwayat-pencarian";
export const MAKS_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<ItemRiwayatPencarian[]> {
  try {
    const data = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    if (!data) return [];
    const parsed: ItemRiwayatPencarian[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function simpanRiwayatPencarian(
  item: Omit<ItemRiwayatPencarian, "timestamp">
): Promise<void> {
  try {
    const daftar = await ambilRiwayatPencarian();

    // Hindari duplikasi: buang jika ada item dengan nama yang sama (case-insensitive) atau id sama
    const filtered = daftar.filter(
      (k) =>
        k.nama.trim().toLowerCase() !== item.nama.trim().toLowerCase() &&
        (item.id === -1 || k.id !== item.id)
    );

    // Masukkan ke urutan terdepan (terbaru)
    const itemBaru: ItemRiwayatPencarian = {
      ...item,
      timestamp: Date.now(),
    };

    const daftarBaru = [itemBaru, ...filtered].slice(0, MAKS_RIWAYAT);
    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
  } catch (err) {
    console.error("Gagal menyimpan riwayat pencarian:", err);
  }
}

export async function hapusItemRiwayat(nama: string, id?: number): Promise<void> {
  try {
    const daftar = await ambilRiwayatPencarian();
    const daftarBaru = daftar.filter((k) => {
      if (id !== undefined && id !== -1 && k.id === id) return false;
      return k.nama.trim().toLowerCase() !== nama.trim().toLowerCase();
    });
    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
  } catch (err) {
    console.error("Gagal menghapus item riwayat:", err);
  }
}

export async function bersihkanSemuaRiwayat(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KUNCI_RIWAYAT);
  } catch (err) {
    console.error("Gagal membersihkan riwayat:", err);
  }
}
