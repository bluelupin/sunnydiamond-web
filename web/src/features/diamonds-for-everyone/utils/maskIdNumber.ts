/** Masks an ID number, showing only the last two characters (Figma review step). */
export function maskIdNumber(value: string): string {
  const cleaned = value.replace(/\s/g, "");
  if (cleaned.length <= 2) {
    return cleaned;
  }
  return `${"X".repeat(cleaned.length - 2)}${cleaned.slice(-2)}`;
}
