import { InventoryForecastPanel } from "@/features/items/application/InventoryForecastPanel";
import { InventoryList } from "@/features/items/application/InventoryList";

export default function ItemsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-white">日用品の在庫状況</h1>
      <InventoryForecastPanel />
      <InventoryList />
    </div>
  );
}
