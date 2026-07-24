/**
 * Magento GraphQL often returns entity ids as base64 (e.g. "MTY=" → "16").
 * Accepts already-numeric values too.
 */
export function decodeMagentoEntityId(raw: string | number | null | undefined): number | null {
  if (raw == null) return null;

  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  const value = String(raw).trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  try {
    const decoded = Buffer.from(value, "base64").toString("utf8").trim();
    // Sometimes "16", sometimes "customer/16" / "Customer:16"
    const match = decoded.match(/(\d+)\s*$/);
    if (match) {
      return Number(match[1]);
    }
  } catch {
    // ignore decode errors
  }

  return null;
}
