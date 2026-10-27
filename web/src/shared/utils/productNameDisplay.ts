/** PDP-style display casing for product names (CSS capitalize). */
export const productNameDisplayClassName = "capitalize";

/** PLP mobile title: first two words on line 1, remainder on line 2. */
export function splitPlpProductTitle(title: string): { lead: string; remainder: string } {
  const trimmed = title.trim();
  if (!trimmed) {
    return { lead: "", remainder: "" };
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) {
    return { lead: trimmed, remainder: "" };
  }

  return {
    lead: words.slice(0, 2).join(" "),
    remainder: words.slice(2).join(" "),
  };
}
