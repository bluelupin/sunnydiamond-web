export const ENGRAVING_FONTS = ["Inter", "Larken", "Gill Sans", "Playfair Display"] as const;

export type EngravingSelection = {
  text: string;
  font: string;
};
