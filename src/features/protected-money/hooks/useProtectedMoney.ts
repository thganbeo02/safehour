import { useEffect, useState } from "react";

import {
  getMoneyProtectedSum,
  getProtectionEntries,
  saveProtectionEntry,
  type ProtectionEntry,
} from "@/storage/db";

import { useProtectedTotalAnimation } from "./useProtectedTotalAnimation";

type SaveProtectionEntryInput = Parameters<typeof saveProtectionEntry>[0];

export function useProtectedMoney() {
  const [totalProtected, setTotalProtected] = useState(0);
  const [entries, setEntries] = useState<ProtectionEntry[]>([]);
  const { displayedTotal, resolveTotal } = useProtectedTotalAnimation();

  async function loadData(options?: { animateFrom?: number }) {
    try {
      const sum = await getMoneyProtectedSum();
      const list = await getProtectionEntries();
      setTotalProtected(sum);
      setEntries(list);
      resolveTotal(sum, options);
    } catch (error) {
      console.error("Failed to load protected money data", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return {
    totalProtected,
    displayedTotalProtected: displayedTotal,
    entries,
    loadData,
    saveEntry: (entry: SaveProtectionEntryInput) => saveProtectionEntry(entry),
  };
}
