import { Card } from "@/shared/components/ui/card";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";

import { useInventoryStore } from "./inventoryStore";

export function InventoryList() {
  const items = useInventoryStore((state) => state.items);

  return (
    <Card title="現在の在庫リスト">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-100">{item.name}</p>
                <p className="text-sm text-slate-400">
                  最終購入日: {formatDate(item.lastPurchasedAt)} / 数量: {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>{item.daysOfSupply} 日分</p>
                <p>{formatCurrency(item.unitPrice)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
