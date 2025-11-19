import type { ParsedReceiptLine } from "@/features/purchase/domain/types";



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
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ocr/receipt`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("レシートの読み取りに失敗しました");
  }

  const data = await response.json() as ParsedReceiptLine[];
  return data;
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
