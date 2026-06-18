export function formatJewelleryPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);
}
