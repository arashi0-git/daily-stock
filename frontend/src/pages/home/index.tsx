import { InventoryForecastPanel } from "@/features/items/application/InventoryForecastPanel";
import { InventoryList } from "@/features/items/application/InventoryList";
import { ReceiptUploadForm } from "@/features/purchase/application/ReceiptUploadForm";
import { Card } from "@/shared/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <header>
        <p className="text-sm uppercase tracking-wider text-brand-300">daily-stock</p>
        <h1 className="text-3xl font-bold text-white">日用品の自動在庫モニタリング</h1>
        <p className="mt-2 text-slate-400">
          レシートをアップロードすると、OCR と GPT による在庫切れ予測が走ります。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="レシートの取り込み" className="lg:col-span-1">
          <ReceiptUploadForm />
        </Card>
        <InventoryForecastPanel />
      </div>

      <InventoryList />
    </div>
  );
}
