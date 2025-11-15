import { create } from "zustand";
import type { InventoryItem, InventoryPrediction } from "@/features/items/domain/types";

type InventoryState = {
  items: InventoryItem[];
  predictions: InventoryPrediction[];
  setItems: (items: InventoryItem[]) => void;
  upsertItemsFromReceipt: (items: InventoryItem[]) => void;
  setPredictions: (predictions: InventoryPrediction[]) => void;
};

const initialItems: InventoryItem[] = [
  {
    id: "toothpaste",
    name: "歯磨き粉",
    category: "daily",
    lastPurchasedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    daysOfSupply: 30,
    quantity: 1,
    unitPrice: 480
  },
  {
    id: "dishsoap",
    name: "食器用洗剤",
    category: "daily",
    lastPurchasedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    daysOfSupply: 25,
    quantity: 1,
    unitPrice: 320
  }
];

export const useInventoryStore = create<InventoryState>((set) => ({
  items: initialItems,
  predictions: [],
  setItems: (items) => set({ items }),
  setPredictions: (predictions) => set({ predictions }),
  upsertItemsFromReceipt: (incoming) =>
    set((state) => {
      const map = new Map(state.items.map((item) => [item.id, item]));
      incoming.forEach((item) => {
        map.set(item.id, {
          ...map.get(item.id),
          ...item,
          lastPurchasedAt: item.lastPurchasedAt ?? new Date().toISOString()
        } as InventoryItem);
      });
      return { items: Array.from(map.values()) };
    })
}));
