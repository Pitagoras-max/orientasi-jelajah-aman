// src/services/favoritStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KotaFavorit } from "../types/favorit";

const KUNCI_PENYIMPANAN = "@jelajah-aman:favorit";

export async function ambilSemuaFavorit(): Promise<KotaFavorit[]> {
    const data = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
    return data ? JSON.parse(data) : [];
}

export async function tambahFavorit(kota: KotaFavorit): Promise<void> {
    const daftar = await ambilSemuaFavorit();
    const sudahAda = daftar.some((k) => k.id === kota.id);
    if (sudahAda) return; // hindari duplikasi

    const daftarBaru = [...daftar, kota];
    await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusFavorit(kotaId: number): Promise<void> {
    const daftar = await ambilSemuaFavorit();
    const daftarBaru = daftar.filter((k) => k.id !== kotaId);
    await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}