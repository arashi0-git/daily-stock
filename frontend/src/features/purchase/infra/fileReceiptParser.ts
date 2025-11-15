import type { ParsedReceiptLine } from "@/features/purchase/domain/types";

const MOCK_IMAGE_ITEMS: ParsedReceiptLine[] = [
  { name: "トイレットペーパー", quantity: 1, unitPrice: 498, isDailyNecessity: true },
  { name: "歯ブラシ", quantity: 2, unitPrice: 320, isDailyNecessity: true },
  { name: "ハンドソープ詰替", quantity: 1, unitPrice: 648, isDailyNecessity: true },
  { name: "ラップ（30cm）", quantity: 1, unitPrice: 278, isDailyNecessity: true },
  { name: "キッチンペーパー", quantity: 1, unitPrice: 398, isDailyNecessity: true }
];

const pickMockItems = (seed: number) => {
  const count = Math.max(1, Math.min(MOCK_IMAGE_ITEMS.length, (seed % 3) + 2));
  return MOCK_IMAGE_ITEMS.slice(0, count);
};

const parseTextReceipt = async (file: File): Promise<ParsedReceiptLine[]> => {
  const content = await file.text();

  const rows = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) {
    return [
      {
        name: file.name.replace(/\.[^.]+$/, "") || "不明な商品",
        quantity: 1,
        unitPrice: 0,
        isDailyNecessity: true
      }
    ];
  }

  return rows.map((line, index) => {
    const [name, qty, price, flag] = line.split(",");
    return {
      name: name ?? `商品-${index + 1}`,
      quantity: Number(qty) || 1,
      unitPrice: Number(price) || 0,
      isDailyNecessity: flag?.trim() !== "0"
    };
  });
};

const parseImageReceipt = async (file: File): Promise<ParsedReceiptLine[]> => {
  const buffer = await file.arrayBuffer();
  let checksum = 0;
  const view = new Uint8Array(buffer);
  for (let index = 0; index < view.length; index += Math.ceil(view.length / 32) || 1) {
    checksum = (checksum + view[index]) % 1000;
  }
  return pickMockItems(checksum);
};

export async function parseReceiptFile(file: File): Promise<ParsedReceiptLine[]> {
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return parseTextReceipt(file);
  }

  if (file.type.startsWith("image/")) {
    return parseImageReceipt(file);
  }

  throw new Error("サポートされていないファイル形式です");
}
