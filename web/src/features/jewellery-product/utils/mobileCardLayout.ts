const LIFESTYLE_CARD_INDICES = new Set([1, 2, 7, 9]);

export function getMobileCardVariant(index: number): "default" | "lifestyle" {
  return LIFESTYLE_CARD_INDICES.has(index % 10) ? "lifestyle" : "default";
}

export function chunkProducts<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}
