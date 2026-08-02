import type {
  NormalizedProductForm,
  StrapiProductForm,
  StrapiProductFormDynamicField,
} from "./product-form.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const findField = (
  fields: StrapiProductFormDynamicField[] | null | undefined,
  match: (field: StrapiProductFormDynamicField, label: string, fieldType: string) => boolean,
): StrapiProductFormDynamicField | undefined =>
  fields?.find((field) => {
    const label = cleanText(field.label)?.toLowerCase() ?? "";
    const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
    return match(field, label, fieldType);
  });

const formatFieldLabel = (field?: StrapiProductFormDynamicField): string | undefined => {
  const label = cleanText(field?.label);
  if (!label) return undefined;
  if (!field?.isRequired) return label;
  return label.endsWith("*") ? label : `${label}*`;
};

export function mapProductForm(
  raw?: StrapiProductForm | null,
): NormalizedProductForm | null {
  if (!raw) return null;

  const formTag = cleanText(raw.formTag);
  if (!formTag) return null;

  const nameField = findField(
    raw.dynamicFields,
    (_field, label, fieldType) =>
      fieldType === "text" && (label.includes("name") || label.includes("full")),
  );
  const phoneField = findField(
    raw.dynamicFields,
    (_field, _label, fieldType) => fieldType === "phone",
  );
  const emailField = findField(
    raw.dynamicFields,
    (_field, _label, fieldType) => fieldType === "email",
  );
  const dateField = findField(
    raw.dynamicFields,
    (_field, _label, fieldType) => fieldType === "date",
  );
  const notesField = findField(
    raw.dynamicFields,
    (_field, label, fieldType) =>
      fieldType === "textarea" ||
      label.includes("request") ||
      label.includes("looking") ||
      label.includes("note") ||
      label.includes("detail"),
  );
  const addressLine1Field = findField(
    raw.dynamicFields,
    (_field, label) => label.includes("address line 1") || label === "address line 1",
  );
  const addressLine2Field = findField(
    raw.dynamicFields,
    (_field, label) => label.includes("address line 2"),
  );
  const pincodeField = findField(
    raw.dynamicFields,
    (_field, label) => label.includes("pincode") || label.includes("pin code"),
  );
  const cityField = findField(
    raw.dynamicFields,
    (_field, label, fieldType) => fieldType === "text" && label === "city",
  );
  const stateField = findField(
    raw.dynamicFields,
    (_field, label) => label === "state",
  );

  const timeSlots =
    raw.availableTimeSlots
      ?.map((slot) => cleanText(slot.timeString))
      .filter((slot): slot is string => Boolean(slot)) ?? [];

  const stateOptions =
    raw.stateOptions
      ?.map(
        (option) =>
          cleanText(option.name) ??
          cleanText(option.label) ??
          cleanText(option.value) ??
          cleanText(option.code),
      )
      .filter((option): option is string => Boolean(option)) ?? [];

  return {
    formName: cleanText(raw.formName) ?? formTag,
    formTag,
    submitButtonText: cleanText(raw.submitButtonText) ?? "Submit",
    stepOneButtonText: cleanText(raw.stepOneButtonText),
    allowImageUpload: Boolean(raw.allowImageUpload),
    isMultiStep: Boolean(raw.isMultiStep),
    timeSlots,
    stateOptions,
    nameLabel: formatFieldLabel(nameField),
    namePlaceholder: cleanText(nameField?.placeholder),
    phoneLabel: formatFieldLabel(phoneField),
    phonePlaceholder: cleanText(phoneField?.placeholder),
    emailLabel: formatFieldLabel(emailField),
    emailPlaceholder: cleanText(emailField?.placeholder),
    dateLabel: formatFieldLabel(dateField),
    notesLabel: formatFieldLabel(notesField) ?? cleanText(notesField?.label),
    notesPlaceholder: cleanText(notesField?.placeholder),
    notesRequired: Boolean(notesField?.isRequired),
    addressLine1Label: formatFieldLabel(addressLine1Field) ?? cleanText(addressLine1Field?.label),
    addressLine1Placeholder: cleanText(addressLine1Field?.placeholder),
    addressLine2Label: cleanText(addressLine2Field?.label),
    addressLine2Placeholder: cleanText(addressLine2Field?.placeholder),
    pincodeLabel: formatFieldLabel(pincodeField) ?? cleanText(pincodeField?.label),
    pincodePlaceholder: cleanText(pincodeField?.placeholder),
    cityLabel: formatFieldLabel(cityField) ?? cleanText(cityField?.label),
    cityPlaceholder: cleanText(cityField?.placeholder),
    stateLabel: formatFieldLabel(stateField) ?? cleanText(stateField?.label),
    statePlaceholder: cleanText(stateField?.placeholder),
  };
}
