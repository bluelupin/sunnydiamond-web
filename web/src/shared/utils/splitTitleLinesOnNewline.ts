/** Splits a title on CMS line breaks (`\n` or literal `\n`); single-line titles are unchanged. */
export function splitTitleLinesOnNewline(title: string): string[] {
  const normalized = title.replace(/\\n/g, "\n").trim();
  if (!normalized) return [];

  if (!/\r?\n/.test(normalized)) {
    return [normalized];
  }

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : [normalized];
}
