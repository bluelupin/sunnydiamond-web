import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveVisitUsCtaFields } from "@/services/product-display/product-display-page.mapper";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.types";
import {
  EMPTY_CONTACT_PAGE,
  type NormalizedContactForm,
  type NormalizedContactHero,
  type NormalizedContactInfoCard,
  type NormalizedContactPage,
  type NormalizedContactResponsiveImage,
  type NormalizedContactSeo,
  type StrapiContactFormDynamicField,
  type StrapiContactFormSection,
  type StrapiContactGenericForm,
  type StrapiContactHeroSection,
  type StrapiContactImageAsset,
  type StrapiContactOption,
  type StrapiContactPage,
  type StrapiContactSeo,
  type StrapiContactSupportSection,
  type StrapiContactVisitSection,
  type StrapiContactVisitShowroom,
} from "./contact-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

/** CMS sections may use `isActive` or `showField`; default visible when unset. */
const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapResponsiveImage = (
  image?: StrapiContactImageAsset | null,
): NormalizedContactResponsiveImage | null => {
  const desktopUrl = resolveCmsMediaUrl(image?.desktopImage) ?? "";
  const mobileUrl = resolveCmsMediaUrl(image?.mobileImage) ?? "";
  if (!desktopUrl && !mobileUrl) return null;

  return {
    desktopUrl,
    mobileUrl,
    desktopAlt: resolveCmsAltText(image?.desktopImage) ?? "",
    mobileAlt: resolveCmsAltText(image?.mobileImage) ?? "",
  };
};

const mapAvailabilityHours = (
  availability?: string | null,
): Array<{ label: string; value: string }> => {
  const text = cleanText(availability);
  if (!text) return [];

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex > 0 && separatorIndex < line.length - 1) {
        const label = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        if (label && value) return { label, value };
      }
      return { label: "", value: line };
    });
};

const toTelHref = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : `tel:${phone}`;
};

const toWhatsAppHref = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits) return `https://wa.me/${digits}`;
  if (/^https?:\/\//i.test(value)) return value;
  return value;
};

/** CMS often stores type names (`phone`, `whatsapp`) in buttonLabel — not UI copy. */
const isGenericButtonLabel = (label?: string): boolean => {
  if (!label) return true;
  return ["phone", "email", "whatsapp", "link", "call", "cta", "button"].includes(
    label.toLowerCase(),
  );
};

const resolveLinkLabel = (
  buttonLabel: string | undefined,
  value: string | undefined,
  title: string,
): string => {
  if (buttonLabel && !isGenericButtonLabel(buttonLabel)) return buttonLabel;
  return value ?? title ?? buttonLabel ?? "";
};

const isActionableContactTarget = (value: string): boolean => {
  if (/^https?:\/\//i.test(value) || value.startsWith("/") || value.includes("wa.me")) {
    return true;
  }
  if (value.includes("@")) return true;
  return /\d{8,}/.test(value);
};

const findField = (
  fields: StrapiContactFormDynamicField[] | null | undefined,
  match: (label: string, fieldType: string) => boolean,
): StrapiContactFormDynamicField | undefined =>
  fields?.find((field) => {
    const label = cleanText(field.label)?.toLowerCase() ?? "";
    const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
    return match(label, fieldType);
  });

const mapFieldOptions = (field?: StrapiContactFormDynamicField): string[] =>
  field?.dropdownOptions
    ?.map((option) => cleanText(option.optionValue))
    .filter((option): option is string => Boolean(option)) ?? [];

const formatFieldLabel = (
  field?: StrapiContactFormDynamicField,
): string | undefined => {
  const label = cleanText(field?.label);
  if (!label) return undefined;
  if (!field?.isRequired) return label;
  return label.endsWith("*") ? label : `${label}*`;
};

const mapContactOption = (
  option: StrapiContactOption | null | undefined,
  phoneFallback?: string | null,
): NormalizedContactInfoCard | null => {
  if (!option || !resolveSectionActive(option.isActive, option.showField)) return null;

  const title = cleanText(option.heading) ?? cleanText(option.title);
  if (!title) return null;

  const type = cleanText(option.type)?.toLowerCase() ?? "";
  const rawValue = cleanText(option.value);
  const buttonLabel = cleanText(option.buttonLabel);
  const description = cleanText(option.description);
  const hours = mapAvailabilityHours(option.availability);
  const lowerButton = buttonLabel?.toLowerCase() ?? "";
  const lowerValue = rawValue?.toLowerCase() ?? "";

  let variant: NormalizedContactInfoCard["variant"] = "link";
  if (type === "phone") variant = "phone";
  else if (type === "email") variant = "email";
  else if (rawValue?.includes("@")) variant = "email";
  else if (rawValue && /^[\d+\s()-]+$/.test(rawValue) && !rawValue.includes("@")) {
    variant = "phone";
  }

  if (!rawValue && variant !== "phone") return null;

  let href: string | null = null;
  let label = resolveLinkLabel(buttonLabel, rawValue, title);

  if (variant === "phone" && rawValue) {
    href = toTelHref(rawValue);
    label = resolveLinkLabel(buttonLabel, rawValue, rawValue);
  } else if (variant === "email" && rawValue) {
    const email = rawValue.replace(/\s+/g, "");
    href = `mailto:${email}`;
    label = resolveLinkLabel(buttonLabel, rawValue, rawValue);
  } else if (rawValue) {
    const isWhatsApp =
      lowerButton.includes("whatsapp") ||
      lowerValue.includes("whatsapp") ||
      lowerValue.includes("wa.me");

    if (isWhatsApp) {
      if (isActionableContactTarget(rawValue)) {
        href = /^https?:\/\//i.test(rawValue) ? rawValue : toWhatsAppHref(rawValue);
      } else if (phoneFallback) {
        href = toWhatsAppHref(phoneFallback);
      } else {
        return null;
      }
      label = resolveLinkLabel(buttonLabel, rawValue, "WHATSAPP");
    } else if (/^https?:\/\//i.test(rawValue) || rawValue.startsWith("/")) {
      href = rawValue;
    } else if (rawValue.includes("@")) {
      const email = rawValue.replace(/\s+/g, "");
      href = `mailto:${email}`;
      variant = "email";
      label = resolveLinkLabel(buttonLabel, rawValue, rawValue);
    } else if (isActionableContactTarget(rawValue)) {
      href = toWhatsAppHref(rawValue);
    } else {
      return null;
    }
  }

  if (!href) return null;

  const id =
    option.id != null
      ? String(option.id)
      : title.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    variant,
    title,
    mobileTitle: variant === "email" && title.toLowerCase().includes("email")
      ? "Email"
      : undefined,
    description,
    hours,
    link: { label, href },
  };
};

const mapHero = (hero?: StrapiContactHeroSection | null): NormalizedContactHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const image = mapResponsiveImage(hero.image) ?? mapResponsiveImage(hero.bgImage);
  if (!image) return null;

  return { title, image };
};

const mapInfoCards = (
  section?: StrapiContactSupportSection | null,
): NormalizedContactInfoCard[] => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) {
    return [];
  }

  const rawOptions = section.contactOptions ?? [];
  const phoneFallback =
    rawOptions
      .map((option) => {
        if (!resolveSectionActive(option?.isActive, option?.showField)) return null;
        const type = cleanText(option?.type)?.toLowerCase();
        const value = cleanText(option?.value);
        if (type === "phone" && value) return value;
        if (value && /^[\d+\s()-]+$/.test(value) && !value.includes("@")) return value;
        return null;
      })
      .find((value): value is string => Boolean(value)) ?? null;

  return rawOptions
    .map((option) => mapContactOption(option, phoneFallback))
    .filter((card): card is NormalizedContactInfoCard => card != null);
};

const mapForm = (section?: StrapiContactFormSection | null): NormalizedContactForm | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const cmsForm: StrapiContactGenericForm | null | undefined = section.form;
  const formTag = cleanText(cmsForm?.formTag);
  const title = cleanText(section.heading) ?? cleanText(cmsForm?.formName);
  const submitLabel = cleanText(cmsForm?.submitButtonText);

  if (!formTag || !title || !submitLabel) return null;

  const fields = cmsForm?.dynamicFields;

  const nameField = findField(
    fields,
    (label, fieldType) =>
      fieldType === "text" && (label.includes("name") || label.includes("full")),
  );
  const phoneField = findField(fields, (_label, fieldType) => fieldType === "phone");
  const emailField = findField(fields, (_label, fieldType) => fieldType === "email");
  const reasonField = findField(
    fields,
    (label, fieldType) =>
      fieldType === "dropdown" &&
      (label.includes("reason") || label.includes("purpose") || label.includes("contact")),
  );
  const messageField = findField(
    fields,
    (label, fieldType) =>
      (fieldType === "textarea" || fieldType === "text") &&
      (label.includes("message") || label.includes("note") || label.includes("describe")),
  );

  const reasonOptions = mapFieldOptions(reasonField);
  const requiresConsent = cmsForm?.requiresConsent !== false;
  const consentLabel = cleanText(cmsForm?.consentLabel);

  return {
    title,
    formTag,
    submitLabel,
    successDescription: cleanText(section.successMessage),
    fields: {
      nameLabel: formatFieldLabel(nameField),
      phoneLabel: formatFieldLabel(phoneField),
      emailLabel: formatFieldLabel(emailField),
      reasonLabel: formatFieldLabel(reasonField),
      reasonPlaceholder: cleanText(reasonField?.placeholder),
      messageLabel: formatFieldLabel(messageField),
      messagePlaceholder: cleanText(messageField?.placeholder),
      fieldPlaceholder: cleanText(nameField?.placeholder),
    },
    reasonOptions,
    requiresConsent,
    ...(consentLabel ? { consentLabel } : {}),
  };
};

const mapShowroomVisitImage = (
  showrooms?: StrapiContactVisitShowroom[] | null,
): NormalizedContactResponsiveImage | null => {
  for (const showroom of showrooms ?? []) {
    if (!showroom || !resolveSectionActive(showroom.isActive, showroom.showField)) continue;

    const mapped = mapResponsiveImage(showroom.image);
    if (mapped) return mapped;
  }

  return null;
};

const mapVisitUs = (section?: StrapiContactVisitSection | null): NormalizedVisitUsSection | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.sectionTitle);
  if (!title) return null;

  const sectionImage = mapResponsiveImage(section.image);
  const showroomImage = mapShowroomVisitImage(section.showrooms);
  const image = sectionImage ?? showroomImage;
  if (!image) return null;

  const desktopUrl = image.desktopUrl;
  const mobileUrl = image.mobileUrl;
  if (!desktopUrl && !mobileUrl) return null;

  const { ctaLabel, ctaUrl, bookVisitFormTag } = resolveVisitUsCtaFields(section);

  return {
    isActive: true,
    title,
    description: cleanText(section.description) ?? "",
    imageSrc: desktopUrl,
    mobileImageSrc: mobileUrl,
    imageAlt: image.desktopAlt || image.mobileAlt || "",
    ctaLabel,
    ...(ctaUrl ? { ctaUrl } : {}),
    ...(bookVisitFormTag ? { bookVisitFormTag } : {}),
  };
};

const mapSeo = (seo?: StrapiContactSeo | null): NormalizedContactSeo | null => {
  if (!seo || !resolveSectionActive(seo.isActive, seo.showField)) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);
  const canonical = cleanText(seo.canonicalUrl);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: canonical
      ? canonical.startsWith("/")
        ? canonical
        : `/${canonical}`
      : "",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

export function mapContactPage(raw?: StrapiContactPage | null): NormalizedContactPage {
  if (!raw) return EMPTY_CONTACT_PAGE;

  const introText = cleanText(raw.introText);

  return {
    hero: mapHero(raw.heroSection),
    intro: introText
      ? { description: introText, mobileDescription: introText }
      : null,
    infoCards: mapInfoCards(raw.contactSection),
    form: mapForm(raw.formSection),
    visitUs: mapVisitUs(raw.visitSection),
    seo: mapSeo(raw.seo),
  };
}

export { EMPTY_CONTACT_PAGE };
