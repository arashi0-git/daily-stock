import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useInventoryStore } from "@/features/items/application/inventoryStore";
import type { InventoryItem } from "@/features/items/domain/types";
import { Button } from "@/shared/components/ui/button";

import { useReceiptParser } from "./useReceiptParser";


const formSchema = z.object({
  receipt: z.instanceof(File, { message: "レシート画像を選択してください" }),
  purchasedAt: z.string().min(1, "購入日を入力してください")
});

type FormValues = z.infer<typeof formSchema>;

type ReceiptUploadFormProps = {
  onComplete?: () => void;
};

export function ReceiptUploadForm({ onComplete }: ReceiptUploadFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasedAt: new Date().toISOString().slice(0, 10),
      receipt: undefined as unknown as File
    }
  });
  const [message, setMessage] = useState<string>();
  const { mutateAsync: parseReceipt, isPending } = useReceiptParser();
  const upsertItems = useInventoryStore((state) => state.upsertItemsFromReceipt);

  const onSubmit = form.handleSubmit((values) => {
    const executor = async () => {
      const lines = await parseReceipt(values.receipt);
      const purchaseDate = new Date(values.purchasedAt).toISOString();

    const items: InventoryItem[] = lines
      .filter((line) => line.isDailyNecessity)
      .map((line, index) => ({
        id: `${line.name}-${line.unitPrice}-${purchaseDate}-${index}`,
        name: line.name,
        category: "daily",
        lastPurchasedAt: purchaseDate,
        daysOfSupply: 30,
        quantity: line.quantity,
          unitPrice: line.unitPrice
        }));

      upsertItems(items);
      setMessage(`${items.length} 件の日用品をインポートしました`);
      onComplete?.();
      form.reset({
        purchasedAt: new Date().toISOString().slice(0, 10),
        receipt: undefined as unknown as File
      });
    };

    void executor();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">レシートファイル</label>
        <Controller
          name="receipt"
          control={form.control}
          defaultValue={undefined as unknown as File}
          render={({ field }) => (
            <input
              type="file"
              accept=".txt,image/png,image/jpeg"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  field.onChange(file);
                }
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          )}
        />
        {form.formState.errors.receipt ? (
          <p className="text-sm text-red-400">{form.formState.errors.receipt.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">購入日</label>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          {...form.register("purchasedAt")}
        />
        {form.formState.errors.purchasedAt ? (
          <p className="text-sm text-red-400">{form.formState.errors.purchasedAt.message}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "解析中..." : "解析して在庫へ追加"}
        </Button>
        {message ? <span className="text-sm text-emerald-300">{message}</span> : null}
      </div>
    </form>
  );
}
