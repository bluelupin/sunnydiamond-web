import { getStrapiBaseUrl } from "@/api/config";
import { extractPincodeFromAddress } from "@/features/stores/utils/storeLocatorFilters";
import type {
  NormalizedGenericForm,
  NormalizedGenericFormField,
  NormalizedGenericFormShowroom,
  StrapiGenericForm,
  StrapiGenericFormDynamicField,
  StrapiGenericFormShowroom,
} from "./generic-form.types";

const FALLBACK_HERO_IMAGE = "/images/products/delivery-store/book-visit-hero.png";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const toAbsoluteMediaUrl = (url?: string | null): string | undefined => {
  const cleaned = cleanText(url);
  if (!cleaned) return undefined;
  if (/^https?:\/\//i.test(cleaned)) return cleaned;

  try {
    const base = getStrapiBaseUrl().replace(/\/$/, "");
    return `${base}${cleaned.startsWith("/") ? cleaned : `/${cleaned}`}`;
  } catch {
    return cleaned;
  }
};

const findField = (
  fields: StrapiGenericFormDynamicField[] | null | undefined,
  match: (field: StrapiGenericFormDynamicField, label: string, fieldType: string) => boolean,
): StrapiGenericFormDynamicField | undefined =>
  fields?.find((field) => {
    const label = cleanText(field.label)?.toLowerCase() ?? "";
    const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
    return match(field, label, fieldType);
  });

const mapFieldOptions = (field?: StrapiGenericFormDynamicField): string[] =>
  field?.dropdownOptions
    ?.map((option) => cleanText(option.optionValue))
    .filter((option): option is string => Boolean(option)) ?? [];

const formatFieldLabel = (field?: StrapiGenericFormDynamicField): string | undefined => {
  const label = cleanText(field?.label);
  if (!label) return undefined;
  if (!field?.isRequired) return label;
  return label.endsWith("*") ? label : `${label}*`;
};

const mapDynamicFields = (
  fields: StrapiGenericFormDynamicField[] | null | undefined,
): NormalizedGenericFormField[] => {
  const mapped: NormalizedGenericFormField[] = [];

  for (const field of fields ?? []) {
    const label = cleanText(field.label);
    const fieldType = cleanText(field.fieldType);
    if (!label || !fieldType) continue;

    mapped.push({
      label,
      fieldType,
      placeholder: cleanText(field.placeholder),
      isRequired: Boolean(field.isRequired),
      options: mapFieldOptions(field),
    });
  }

  return mapped;
};

const mapShowroom = (
  showroom: StrapiGenericFormShowroom,
): NormalizedGenericFormShowroom | null => {
  if (showroom.isActive === false) return null;

  const storeName = cleanText(showroom.name) ?? cleanText(showroom.city);
  if (!storeName) return null;

  const id =
    cleanText(showroom.slug) ??
    (showroom.id != null ? String(showroom.id) : storeName.toLowerCase().replace(/\s+/g, "-"));

  const heroImage =
    toAbsoluteMediaUrl(showroom.image?.desktopImage?.url) ??
    toAbsoluteMediaUrl(showroom.image?.mobileImage?.url) ??
    FALLBACK_HERO_IMAGE;

  return {
    id,
    documentId: cleanText(showroom.documentId),
    tabLabel: storeName.toUpperCase(),
    storeName,
    address: cleanText(showroom.address) ?? storeName,
    phone: cleanText(showroom.phone) ?? "",
    directionsUrl:
      cleanText(showroom.mapUrl) ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeName)}`,
    heroImage,
    city: cleanText(showroom.city),
    state: cleanText(showroom.state),
    pincode: extractPincodeFromAddress(cleanText(showroom.address)),
  };
};

export function mapGenericForm(
  raw?: StrapiGenericForm | null,
): NormalizedGenericForm | null {
  if (!raw) return null;

  const formTag = cleanText(raw.formTag);
  if (!formTag) return null;

  const showrooms =
    raw.showrooms
      ?.slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapShowroom)
      .filter((item): item is NormalizedGenericFormShowroom => item != null) ?? [];

  const timeSlots =
    raw.availableTimeSlots
      ?.map((slot) => cleanText(slot.timeString))
      .filter((slot): slot is string => Boolean(slot)) ?? [];

  const purposeField = findField(
    raw.dynamicFields,
    (_field, label) =>
      label.includes("purpose") || label.includes("reason") || label.includes("contacting"),
  );
  const notesField = findField(
    raw.dynamicFields,
    (_field, label) =>
      label.includes("note") || label.includes("describe") || label.includes("message"),
  );
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

  return {
    formName: cleanText(raw.formName) ?? formTag,
    formTag,
    submitButtonText: cleanText(raw.submitButtonText) ?? "Submit",
    timeSlots,
    showrooms,
    purposeOptions: mapFieldOptions(purposeField),
    purposeLabel: cleanText(purposeField?.label),
    purposePlaceholder: cleanText(purposeField?.placeholder),
    notesLabel: cleanText(notesField?.label),
    notesPlaceholder: cleanText(notesField?.placeholder),
    nameLabel: formatFieldLabel(nameField),
    namePlaceholder: cleanText(nameField?.placeholder),
    phoneLabel: formatFieldLabel(phoneField),
    phonePlaceholder: cleanText(phoneField?.placeholder),
    emailLabel: formatFieldLabel(emailField),
    emailPlaceholder: cleanText(emailField?.placeholder),
    dateLabel: formatFieldLabel(dateField),
    datePlaceholder: cleanText(dateField?.placeholder),
    fields: mapDynamicFields(raw.dynamicFields),
  };
}
