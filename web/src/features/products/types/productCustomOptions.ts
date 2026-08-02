export type ProductCustomOptionField = {
  optionUid: string;
};

export type ProductCustomOptionChoice = {
  optionUid: string;
  valuesByLabel: Record<string, string>;
};

export type ProductCustomOptions = {
  engravingText?: ProductCustomOptionField;
  engravingFont?: ProductCustomOptionChoice;
  ringSize?: ProductCustomOptionChoice;
  metal?: ProductCustomOptionChoice;
};
