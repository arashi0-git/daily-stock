type InventoryPredictionRequest = {
  items: Array<{
    id: string;
    name: string;
    lastPurchasedAt: string;
    daysOfSupply: number;
  }>;
};

type InventoryPredictionResponse = {
  itemId: string;
  stockoutDate: string;
  confidence: number;
}[];

const pseudoRandom = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash % 7);
};

export async function mockPredictInventory(
  payload: InventoryPredictionRequest
): Promise<InventoryPredictionResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = payload.items.map((item) => {
        const offset = pseudoRandom(item.id);
        const predicted = new Date(item.lastPurchasedAt);
        predicted.setDate(predicted.getDate() + item.daysOfSupply + offset);

        return {
          itemId: item.id,
          stockoutDate: predicted.toISOString(),
          confidence: 0.7 + offset * 0.03
        };
      });
      resolve(response);
    }, 400);
  });
}
