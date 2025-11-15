import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatDate } from "@/shared/utils/formatters";
import { useInventoryStore } from "./inventoryStore";
import { useInventoryForecast } from "./useInventoryForecast";

export function InventoryForecastPanel() {
  const { isLoading, refetch } = useInventoryForecast();
  const predictions = useInventoryStore((state) => state.predictions);
  const items = useInventoryStore((state) => state.items);

  return (
    <Card title="在庫切れ予測" className="space-y-3 lg:col-span-2">
      {isLoading ? (
        <p className="text-sm text-slate-400">在庫予測を計算しています...</p>
      ) : (
        <div className="space-y-3">
          {predictions.map((prediction) => {
            const label = items.find((item) => item.id === prediction.itemId)?.name ?? prediction.itemId;
            return (
              <div
                key={prediction.itemId}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{label}</p>
                  <p className="text-xs text-slate-400">在庫切れ予想: {formatDate(prediction.stockoutDate)}</p>
                </div>
                <p className="text-sm text-emerald-300">
                  信頼度 {(prediction.confidence * 100).toFixed(0)}%
                </p>
              </div>
            );
          })}
        </div>
      )}
      <Button variant="ghost" onClick={() => refetch()}>
        再予測
      </Button>
    </Card>
  );
}
