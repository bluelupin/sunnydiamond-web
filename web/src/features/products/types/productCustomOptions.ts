export type ProductCustomOptionField = {
  optionUid: string;
};

export type ProductCustomOptionChoice = {
  optionUid: string;
  valuesByLabel: Record<string, string>;
  /** Original Magento option titles, in catalog order — use for dropdowns. */
  labels: string[];
};

export type ProductCustomOptions = {
  engravingText?: ProductCustomOptionField;
  engravingFont?: ProductCustomOptionChoice;
  ringSize?: ProductCustomOptionChoice;
  metal?: ProductCustomOptionChoice;
};
