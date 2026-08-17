export type ProductCustomOptionField = {
  optionUid: string;
  /** Numeric id decoded from the uid — updateCartItems requires it (uid silently wipes options). */
  optionId: number;
  maxCharacters: number | null;
};

export type ProductCustomOptionChoiceValue = {
  valueUid: string;
  /** Magento option_type_id — updateCartItems value_string for dropdown options. */
  optionTypeId: number | null;
};

export type ProductCustomOptionChoice = {
  optionUid: string;
  /** Numeric id decoded from the uid — updateCartItems requires it (uid silently wipes options). */
  optionId: number;
  valuesByLabel: Record<string, string>;
  valueMetaByLabel: Record<string, ProductCustomOptionChoiceValue>;
  /** Original Magento option titles, in catalog order — use for dropdowns. */
  labels: string[];
};

export type ProductCustomOptions = {
  engravingText?: ProductCustomOptionField;
  engravingFont?: ProductCustomOptionChoice;
  ringSize?: ProductCustomOptionChoice;
  metal?: ProductCustomOptionChoice;
  /** Hidden Magento field option — dedupes cart lines without showing in PDP UI. */
  lineInstance?: ProductCustomOptionField;
};
