import { ReceiptUploadForm } from "@/features/purchase/application/ReceiptUploadForm";
import { Card } from "@/shared/components/ui/card";

export default function PurchasePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-white">レシートからの在庫登録</h1>
      <Card title="OCR / AI 解析用アップロード">
        <ReceiptUploadForm />
      </Card>
    </div>
  );
}
