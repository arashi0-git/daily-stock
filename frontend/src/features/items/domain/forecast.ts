import type { InventoryItem } from "./types";

export type Forecast = {
  itemId: string;
  stockoutDate: string;
  confidence: number;
};

export function estimateReorderDate(item: InventoryItem, adjustment = 0): Forecast {
  const lastPurchase = new Date(item.lastPurchasedAt);
  if (Number.isNaN(lastPurchase.getTime())) {
    lastPurchase.setDate(new Date().getDate());
  }

  const stockout = new Date(lastPurchase);
  stockout.setDate(stockout.getDate() + item.daysOfSupply + adjustment);

  const normalizedConfidence = Math.max(0.5, Math.min(0.99, 0.8 + adjustment * 0.02));

  return {
    itemId: item.id,
    stockoutDate: stockout.toISOString(),
    confidence: normalizedConfidence
  };
}
