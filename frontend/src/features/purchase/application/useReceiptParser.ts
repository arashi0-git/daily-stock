import { useMutation } from "@tanstack/react-query";
import { parseReceiptFile } from "@/features/purchase/infra/fileReceiptParser";

export function useReceiptParser() {
  return useMutation({
    mutationKey: ["receipt-parser"],
    mutationFn: parseReceiptFile
  });
}
