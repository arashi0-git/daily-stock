export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(value));
