import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInventoryStore } from "./inventoryStore";
import { mockPredictInventory } from "@/features/items/infra/mockInventoryClient";

export function useInventoryForecast() {
  const items = useInventoryStore((state) => state.items);
  const setPredictions = useInventoryStore((state) => state.setPredictions);

  const query = useQuery({
    queryKey: ["inventory-forecast", items],
    queryFn: () =>
      mockPredictInventory({
        items: items
          .filter((item) => item.category === "daily")
          .map((item) => ({
            id: item.id,
            name: item.name,
            lastPurchasedAt: item.lastPurchasedAt,
            daysOfSupply: item.daysOfSupply
          }))
      }),
    enabled: items.length > 0
  });

  useEffect(() => {
    if (query.data) {
      setPredictions(query.data);
    }
  }, [query.data, setPredictions]);

  return {
    predictions: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch
  };
}
