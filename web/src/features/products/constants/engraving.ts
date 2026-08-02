export const DEFAULT_ENGRAVING_FONTS = ["Gill Sans", "Larken"] as const;

export const DEFAULT_ENGRAVING_MAX_CHARACTERS = 30;

/** @deprecated Use DEFAULT_ENGRAVING_FONTS */
export const ENGRAVING_FONTS = DEFAULT_ENGRAVING_FONTS;

export type ProductEngravingConfig = {
  enabled: boolean;
  maxCharacters: number;
  fonts: string[];
  previewImage?: string;
};

export type EngravingSelection = {
  text: string;
  font: string;
};

export function resolveEngravingFonts(fonts?: readonly string[] | null): string[] {
  const cleaned = (fonts ?? [])
    .map((font) => font.trim())
    .filter((font) => font.length > 0);

  return cleaned.length > 0 ? cleaned : [...DEFAULT_ENGRAVING_FONTS];
}

export function resolveEngravingMaxCharacters(
  value: string | number | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

export function clampEngravingText(text: string, maxCharacters: number): string {
  return text.slice(0, maxCharacters);
}
