export const ENGRAVING_FONTS = ["Gill Sans", "Larken"] as const;

export type EngravingSelection = {
  text: string;
  font: string;
};
