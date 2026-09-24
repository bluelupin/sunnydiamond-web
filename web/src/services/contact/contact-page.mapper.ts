import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.types";
import {
  EMPTY_CONTACT_PAGE,
  type NormalizedContactDropdownField,
  type NormalizedContactForm,
  type NormalizedContactHero,
  type NormalizedContactInfoCard,
  type NormalizedContactOrderedField,
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
      // Split day label from time; keep CMS colon on the label when present (Figma: "Sunday:").
      const match = line.match(
        /^(.+?)(\s*:)?\s+(\d{1,2}:\d{2}\s*[AaPp][Mm]\b.*)$/,
      );
      if (match) {
        const dayPart = match[1].trim();
        const value = match[3].trim();
        if (dayPart && value) {
          return {
            label: match[2] ? `${dayPart}:` : dayPart,
            value,
          };
        }
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

/** Normalize garbled CMS email strings for mailto hrefs. */
const formatEmailAddress = (value: string): string => {
  const compact = value.replace(/\s+/g, "");
  const match = compact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!match) return value.trim();

  return match[0]
    .toLowerCase()
    .replace("@sunntdiamonds.com", "@sunnydiamonds.com");
};

/** Preserve CMS email CTA copy; only fix known domain typos. */
const sanitizeEmailLinkLabel = (label: string): string =>
  label.replace(/@sunntdiamonds\.com/gi, "@SUNNYDIAMONDS.COM");

/** Fallback when CMS omits a usable email buttonLabel. */
const formatEmailLinkDisplay = (email: string): string => {
  const [localPart, domain = ""] = email.split("@");
  return `${localPart.toUpperCase()}@${domain.toUpperCase()}`;
};

const resolveWhatsAppLinkLabel = (buttonLabel: string | undefined): string => {
  const cmsLabel = cleanText(buttonLabel);
  if (cmsLabel) return cmsLabel;

  return "WHATSAPP";
};

const resolveLinkLabel = (
  buttonLabel: string | undefined,
  value: string | undefined,
  title: string,
): string => {
  if (buttonLabel && !isGenericButtonLabel(buttonLabel)) return buttonLabel;
  return value ?? title ?? buttonLabel ?? "";
};

/** Prefer CMS buttonLabel; fall back to normalized value only when CMS label is missing/generic. */
const resolveEmailLinkLabel = (
  buttonLabel: string | undefined,
  email: string,
): string => {
  const cmsLabel = cleanText(buttonLabel);

  if (cmsLabel && !isGenericButtonLabel(cmsLabel)) {
    return cmsLabel.includes("@") ? sanitizeEmailLinkLabel(cmsLabel) : cmsLabel;
  }

  return formatEmailLinkDisplay(email);
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

/** Dropdowns: fieldType dropdown/select, or CMS text fields that still ship options. */
const isDropdownField = (field: StrapiContactFormDynamicField): boolean => {
  const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
  if (fieldType === "dropdown" || fieldType === "select") return true;
  return mapFieldOptions(field).length > 0;
};

const mapDropdownFields = (
  fields: StrapiContactFormDynamicField[] | null | undefined,
): NormalizedContactDropdownField[] => {
  if (!fields?.length) return [];

  const mapped: NormalizedContactDropdownField[] = [];
  for (const [index, field] of fields.entries()) {
    if (!isDropdownField(field)) continue;
    const options = mapFieldOptions(field);
    if (options.length === 0) continue;

    const label = cleanText(field.label) ?? `Option ${index + 1}`;
    const placeholder = cleanText(field.placeholder);
    mapped.push({
      id: field.id != null ? String(field.id) : `dropdown-${index}`,
      label,
      ...(placeholder ? { placeholder } : {}),
      options,
      isRequired: Boolean(field.isRequired),
    });
  }
  return mapped;
};

/** Preserve CMS `dynamicFields` array order (drag-and-drop). No label whitelist — every field renders. */
const mapOrderedFields = (
  fields: StrapiContactFormDynamicField[] | null | undefined,
): NormalizedContactOrderedField[] => {
  if (!fields?.length) return [];

  const ordered: NormalizedContactOrderedField[] = [];
  const seen = new Set<string>();

  for (const [index, field] of fields.entries()) {
    const label = cleanText(field.label);
    const labelLower = label?.toLowerCase() ?? "";
    const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
    const id = field.id != null ? String(field.id) : `field-${index}`;

    if (isDropdownField(field)) {
      const options = mapFieldOptions(field);
      if (options.length === 0) continue;
      ordered.push({ kind: "dropdown", id });
      continue;
    }

    if (fieldType === "phone" && !seen.has("phone")) {
      seen.add("phone");
      ordered.push({ kind: "phone" });
      continue;
    }

    if (fieldType === "email" && !seen.has("email")) {
      seen.add("email");
      ordered.push({ kind: "email" });
      continue;
    }

    // Bind known submit fields once; any other text/textarea still renders.
    if (
      !seen.has("name") &&
      fieldType === "text" &&
      (labelLower.includes("name") || labelLower.includes("full"))
    ) {
      seen.add("name");
      ordered.push({ kind: "name" });
      continue;
    }

    if (
      !seen.has("message") &&
      (fieldType === "textarea" || fieldType === "text") &&
      (labelLower.includes("message") ||
        labelLower.includes("note") ||
        labelLower.includes("describe"))
    ) {
      seen.add("message");
      ordered.push({ kind: "message" });
      continue;
    }

    // Newly added CMS fields (any label / type) — always surface on UI.
    if (!label) continue;
    const placeholder = cleanText(field.placeholder);
    ordered.push({
      kind: "text",
      id,
      label,
      ...(placeholder ? { placeholder } : {}),
      isRequired: Boolean(field.isRequired),
      multiline: fieldType === "textarea",
    });
  }

  return ordered;
};

const mapContactOption = (
  option: StrapiContactOption | null | undefined,
): NormalizedContactInfoCard | null => {
  if (!option || !resolveSectionActive(option.isActive, option.showField)) return null;

  const title = cleanText(option.heading) ?? cleanText(option.title);
  if (!title) return null;

  const type = cleanText(option.type)?.toLowerCase() ?? "";
  // CTA requires both CMS URL and label — never invent either from the other.
  const linkUrl = cleanText(option.value) ?? cleanText(option.cta?.url);
  const buttonLabel = cleanText(option.buttonLabel) ?? cleanText(option.cta?.label);
  const description = cleanText(option.description);
  // CMS removed `availability`; Call Us hours now live on `description` (same key as email/WhatsApp).
  const hours = mapAvailabilityHours(option.description ?? option.availability);
  const lowerButton = buttonLabel?.toLowerCase() ?? "";
  const lowerUrl = linkUrl?.toLowerCase() ?? "";

  let variant: NormalizedContactInfoCard["variant"] = "link";
  if (type === "phone") variant = "phone";
  else if (type === "email") variant = "email";
  else if (linkUrl && (linkUrl.includes("@") || linkUrl.startsWith("mailto:"))) {
    variant = "email";
  } else if (linkUrl && /^tel:/i.test(linkUrl)) {
    variant = "phone";
  }

  let href: string | undefined;
  let label: string | undefined;

  if (linkUrl && buttonLabel) {
    label = buttonLabel;

    if (variant === "phone") {
      href = /^tel:/i.test(linkUrl) ? linkUrl : toTelHref(linkUrl);
    } else if (variant === "email") {
      const emailSource = linkUrl.replace(/^mailto:/i, "");
      const email = formatEmailAddress(emailSource);
      href = /^mailto:/i.test(linkUrl) ? linkUrl : `mailto:${email}`;
      if (buttonLabel.includes("@")) {
        label = sanitizeEmailLinkLabel(buttonLabel);
      }
    } else {
      const isWhatsApp =
        lowerButton.includes("whatsapp") ||
        lowerUrl.includes("whatsapp") ||
        lowerUrl.includes("wa.me");

      if (isWhatsApp) {
        if (isActionableContactTarget(linkUrl)) {
          href = /^https?:\/\//i.test(linkUrl) ? linkUrl : toWhatsAppHref(linkUrl);
        }
      } else if (/^https?:\/\//i.test(linkUrl) || linkUrl.startsWith("/")) {
        href = linkUrl;
      } else if (linkUrl.includes("@")) {
        const email = formatEmailAddress(linkUrl);
        href = `mailto:${email}`;
        variant = "email";
        if (buttonLabel.includes("@")) {
          label = sanitizeEmailLinkLabel(buttonLabel);
        }
      } else if (isActionableContactTarget(linkUrl)) {
        href = toWhatsAppHref(linkUrl);
      }
    }

    // Invalid/unusable URL → hide CTA entirely (no hanging label).
    if (!href) {
      label = undefined;
    }
  }

  const id =
    option.id != null
      ? String(option.id)
      : title.toLowerCase().replace(/\s+/g, "-");

  const ctaTargetType = cleanText(option.cta?.targetType)?.toLowerCase();
  const ctaOpenInNewTab =
    typeof option.cta?.openInNewTab === "boolean"
      ? option.cta.openInNewTab
      : undefined;

  return {
    id,
    variant,
    title,
    mobileTitle: variant === "email" && title.toLowerCase().includes("email")
      ? "Email"
      : undefined,
    description,
    hours,
    link: {
      label: label ?? "",
      ...(href ? { href } : {}),
      ...(ctaTargetType ? { targetType: ctaTargetType } : {}),
      ...(typeof ctaOpenInNewTab === "boolean"
        ? { openInNewTab: ctaOpenInNewTab }
        : {}),
    },
  };
};

const mapHero = (hero?: StrapiContactHeroSection | null): NormalizedContactHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  // Banner (`image`, else `bgImage`) wins when present; video only if banner is empty.
  const image = mapResponsiveImage(hero.image) ?? mapResponsiveImage(hero.bgImage);
  const videoUrl = image
    ? undefined
    : getCmsAssetUrl(resolveCmsMediaUrl(hero.heroVideo?.heroVideo));

  return {
    title,
    image,
    ...(videoUrl ? { videoUrl } : {}),
  };
};

const mapInfoCards = (
  section?: StrapiContactSupportSection | null,
): NormalizedContactInfoCard[] => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) {
    return [];
  }

  const rawOptions = section.contactOptions ?? [];

  return rawOptions
    .map((option) => mapContactOption(option))
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
  const messageField = fields?.find((field) => {
    if (isDropdownField(field)) return false;
    const label = cleanText(field.label)?.toLowerCase() ?? "";
    const fieldType = cleanText(field.fieldType)?.toLowerCase() ?? "";
    return (
      (fieldType === "textarea" || fieldType === "text") &&
      (label.includes("message") || label.includes("note") || label.includes("describe"))
    );
  });

  const dropdownFields = mapDropdownFields(fields);
  const primaryDropdown = dropdownFields[0];
  const reasonOptions =
    mapFieldOptions(reasonField).length > 0
      ? mapFieldOptions(reasonField)
      : (primaryDropdown?.options ?? []);
  const consentLabel = cleanText(cmsForm?.consentLabel);
  const requiresConsent = cmsForm?.requiresConsent !== false && Boolean(consentLabel);
  const namePlaceholder = cleanText(nameField?.placeholder);
  const reasonLabel =
    formatFieldLabel(reasonField) ??
    (primaryDropdown
      ? primaryDropdown.isRequired && !primaryDropdown.label.endsWith("*")
        ? `${primaryDropdown.label}*`
        : primaryDropdown.label
      : undefined);

  return {
    title,
    formTag,
    submitLabel,
    successDescription: cleanText(section.successMessage),
    fields: {
      nameLabel: formatFieldLabel(nameField),
      phoneLabel: formatFieldLabel(phoneField),
      emailLabel: formatFieldLabel(emailField),
      reasonLabel,
      reasonPlaceholder:
        cleanText(reasonField?.placeholder) ?? primaryDropdown?.placeholder,
      messageLabel: formatFieldLabel(messageField),
      messagePlaceholder: cleanText(messageField?.placeholder),
      namePlaceholder,
      phonePlaceholder: cleanText(phoneField?.placeholder),
      emailPlaceholder: cleanText(emailField?.placeholder),
      fieldPlaceholder: namePlaceholder,
    },
    dropdownFields,
    orderedFields: mapOrderedFields(fields),
    reasonOptions,
    requiresConsent,
    ...(consentLabel ? { consentLabel } : {}),
  };
};

/**
 * Contact Visit Us — fields matching CMS editor only:
 * title, welcomeNote, backgroundImage (or image if present), cta, showField.
 * Ignores leftover API `description` (not in Contact Visit CMS UI).
 * CTA opens Book a Visit panel (same as PDP when cta.url is null).
 */
const mapVisitUs = (
  section?: StrapiContactVisitSection | null,
): NormalizedVisitUsSection | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) {
    return null;
  }

  const title = cleanText(section.sectionTitle);
  if (!title) return null;

  const welcomeNote = cleanText(section.welcomeNote);

  // Prefer explicit `image` if CMS sets it; else section `backgroundImage`.
  const sectionImage =
    mapResponsiveImage(section.image) ?? mapResponsiveImage(section.backgroundImage);
  const imageSrc = sectionImage?.desktopUrl || sectionImage?.mobileUrl || "";
  const mobileImageSrc =
    sectionImage?.mobileUrl && sectionImage.mobileUrl !== imageSrc
      ? sectionImage.mobileUrl
      : undefined;
  const imageAlt = sectionImage?.desktopAlt || sectionImage?.mobileAlt || "";

  const ctaLabel = cleanText(section.appointmentLabel);
  // Contact Visit CTA matches PDP Book a Visit: open panel (label only — no URL / openInNewTab).
  const bookVisitFormTag = cleanText(section.formCta?.modalTag);

  return {
    isActive: true,
    title,
    // Do not map API `description` — not exposed in Contact Visit CMS UI.
    description: "",
    ...(welcomeNote ? { welcomeNote } : {}),
    imageSrc,
    ...(mobileImageSrc ? { mobileImageSrc } : {}),
    ...(imageAlt ? { imageAlt } : {}),
    ctaLabel: ctaLabel ?? "",
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
