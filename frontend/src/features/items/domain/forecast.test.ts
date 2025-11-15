import { describe, expect, it } from "vitest";

import { estimateReorderDate } from "./forecast";

describe("estimateReorderDate", () => {
  it("computes stockout date with adjustment", () => {
    const item = {
      id: "paper",
      name: "紙タオル",
      category: "daily" as const,
      lastPurchasedAt: "2024-03-01T00:00:00.000Z",
      daysOfSupply: 10,
      quantity: 1,
      unitPrice: 300
    };

    const { stockoutDate } = estimateReorderDate(item, 2);
    expect(stockoutDate).toBe("2024-03-13T00:00:00.000Z");
  });
});
