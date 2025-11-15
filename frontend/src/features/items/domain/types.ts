export type InventoryItem = {
  id: string;
  name: string;
  category: "daily" | "food" | "other";
  lastPurchasedAt: string;
  daysOfSupply: number;
  quantity: number;
  unitPrice: number;
};

export type InventoryPrediction = {
  itemId: string;
  stockoutDate: string;
  confidence: number;
};
