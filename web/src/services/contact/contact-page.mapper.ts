import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { contactPageContent } from "@/features/contact/data/content";
import {
  VISIT_US_FALLBACK,
  type NormalizedVisitUsSection,
} from "@/services/product-display/product-display-page.types";
import type {
  NormalizedContactForm,
  NormalizedContactHero,
  NormalizedContactInfoCard,
  NormalizedContactPage,
  NormalizedContactSeo,
  StrapiContactFormDynamicField,
  StrapiContactFormSection,
  StrapiContactGenericForm,
  StrapiContactHeroSection,
  StrapiContactImageAsset,
  StrapiContactOption,
  StrapiContactPage,
  StrapiContactSeo,
  StrapiContactSupportSection,
  StrapiContactVisitSection,
  StrapiContactVisitShowroom,
} from "./contact-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
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
  fallback: string,
): string => {
  if (buttonLabel && !isGenericButtonLabel(buttonLabel)) return buttonLabel;
  return value ?? buttonLabel ?? fallback;
};

const isActionableContactTarget = (value: string): boolean => {
  if (/^https?:\/\//i.test(value) || value.startsWith("/") || value.includes("wa.me")) {
    return true;
  }
  if (value.includes("@")) return true;
  return /\d{8,}/.test(value);
};

const FALLBACK_WHATSAPP_HREF =
  contactPageContent.infoCards.find((card) => card.id === "concierge")?.link.href ??
  "https://wa.me/919744355555";

const mapImageAsset = (
  image?: StrapiContactImageAsset | null,
): { desktopUrl?: string; mobileUrl?: string; alt?: string } => {
  const desktopUrl = resolveCmsMediaUrl(image?.desktopImage);
  const mobileUrl = resolveCmsMediaUrl(image?.mobileImage);
  const alt = resolveCmsAltText(image?.desktopImage) ?? "";

  return { desktopUrl, mobileUrl, alt };
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
  field: StrapiContactFormDynamicField | undefined,
  fallback: string,
): string => {
  const label = cleanText(field?.label);
  if (!label) return fallback;
  if (!field?.isRequired) return label;
  return label.endsWith("*") ? label : `${label}*`;
};

const fallbackInfoCards = (): NormalizedContactInfoCard[] =>
  contactPageContent.infoCards.map((card) => {
    if (card.id === "call") {
      return {
        id: card.id,
        variant: "phone" as const,
        title: card.title,
        hours: card.hours.map((entry) => ({ ...entry })),
        link: { ...card.link },
      };
    }
    if (card.id === "email") {
      return {
        id: card.id,
        variant: "email" as const,
        title: card.title,
        mobileTitle: card.mobileTitle,
        description: card.description,
        hours: [],
        link: { ...card.link },
      };
    }
    return {
      id: card.id,
      variant: "link" as const,
      title: card.title,
      description: card.description,
      hours: [],
      link: { ...card.link },
    };
  });

const mapContactOption = (
  option: StrapiContactOption | null | undefined,
  phoneFallback?: string | null,
): NormalizedContactInfoCard | null => {
  if (!option || !resolveSectionActive(option.isActive)) return null;

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

  let href = "#";
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
        href = FALLBACK_WHATSAPP_HREF;
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
      href = FALLBACK_WHATSAPP_HREF;
      label = resolveLinkLabel(buttonLabel, rawValue, "WHATSAPP");
    }
  }

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

const mapHero = (hero?: StrapiContactHeroSection | null): NormalizedContactHero => {
  const fallback = contactPageContent.hero;
  if (!hero || !resolveSectionActive(hero.isActive)) {
    return {
      title: fallback.title,
      image: {
        desktopUrl: fallback.image.desktopUrl,
        mobileUrl: fallback.image.mobileUrl,
        alt: fallback.image.alt,
      },
    };
  }

  const fromImage = mapImageAsset(hero.image);
  const fromBg = mapImageAsset(hero.bgImage);
  const desktopUrl =
    fromImage.desktopUrl ??
    fromBg.desktopUrl ??
    fromImage.mobileUrl ??
    fromBg.mobileUrl ??
    fallback.image.desktopUrl;
  const mobileUrl =
    fromImage.mobileUrl ??
    fromBg.mobileUrl ??
    fromImage.desktopUrl ??
    fromBg.desktopUrl ??
    fallback.image.mobileUrl;

  return {
    title: cleanText(hero.title) ?? fallback.title,
    image: {
      desktopUrl,
      mobileUrl,
      alt: fromImage.alt ?? fromBg.alt ?? "",
    },
  };
};

const mapInfoCards = (
  section?: StrapiContactSupportSection | null,
): NormalizedContactInfoCard[] => {
  if (!section || !resolveSectionActive(section.isActive)) {
    return fallbackInfoCards();
  }

  const rawOptions = section.contactOptions ?? [];
  const phoneFallback =
    rawOptions
      .map((option) => {
        if (!resolveSectionActive(option?.isActive)) return null;
        const type = cleanText(option?.type)?.toLowerCase();
        const value = cleanText(option?.value);
        if (type === "phone" && value) return value;
        if (value && /^[\d+\s()-]+$/.test(value) && !value.includes("@")) return value;
        return null;
      })
      .find((value): value is string => Boolean(value)) ?? null;

  const cards = rawOptions
    .map((option) => mapContactOption(option, phoneFallback))
    .filter((card): card is NormalizedContactInfoCard => card != null);

  return cards.length > 0 ? cards : fallbackInfoCards();
};

const mapForm = (section?: StrapiContactFormSection | null): NormalizedContactForm => {
  const fallback = contactPageContent.form;
  const cmsForm: StrapiContactGenericForm | null | undefined = section?.form;
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
  const sectionActive = !section || resolveSectionActive(section.isActive);

  return {
    title:
      (sectionActive ? cleanText(section?.heading) : undefined) ??
      cleanText(cmsForm?.formName) ??
      fallback.title,
    formTag:
      (sectionActive ? cleanText(cmsForm?.formTag) : undefined) ?? fallback.formTag,
    submitLabel:
      (sectionActive ? cleanText(cmsForm?.submitButtonText) : undefined) ??
      fallback.submitLabel,
    successTitle: fallback.successTitle,
    successDescription:
      (sectionActive ? cleanText(section?.successMessage) : undefined) ??
      fallback.successDescription,
    fields: {
      nameLabel: formatFieldLabel(nameField, fallback.fields.nameLabel),
      phoneLabel: formatFieldLabel(phoneField, fallback.fields.phoneLabel),
      emailLabel: formatFieldLabel(emailField, fallback.fields.emailLabel),
      reasonLabel: formatFieldLabel(reasonField, fallback.fields.reasonLabel),
      reasonPlaceholder:
        cleanText(reasonField?.placeholder) ?? fallback.fields.reasonPlaceholder,
      mobileReasonPlaceholder: fallback.fields.mobileReasonPlaceholder,
      messageLabel: formatFieldLabel(messageField, fallback.fields.messageLabel),
      messagePlaceholder:
        cleanText(messageField?.placeholder) ?? fallback.fields.messagePlaceholder,
      mobileMessagePlaceholder: fallback.fields.mobileMessagePlaceholder,
      mobileFieldPlaceholder: fallback.fields.mobileFieldPlaceholder,
    },
    reasonOptions: reasonOptions.length > 0 ? reasonOptions : [...fallback.reasonOptions],
    consentPrefix: fallback.consentPrefix,
    consentSuffix: fallback.consentSuffix,
    mobileConsentSuffix: fallback.mobileConsentSuffix,
    termsLabel: fallback.termsLabel,
    mobileTermsLabel: fallback.mobileTermsLabel,
    privacyLabel: fallback.privacyLabel,
    mobilePrivacyLabel: fallback.mobilePrivacyLabel,
    consentError: fallback.consentError,
  };
};

const mapVisitUs = (section?: StrapiContactVisitSection | null): NormalizedVisitUsSection => {
  const fallback: NormalizedVisitUsSection = {
    title: contactPageContent.visitUs.title,
    description: contactPageContent.visitUs.description,
    // Shared PDP Visit Us asset — not contact-only static files.
    imageSrc: VISIT_US_FALLBACK.imageSrc,
    mobileImageSrc: VISIT_US_FALLBACK.mobileImageSrc,
    imageAlt: contactPageContent.visitUs.imageAlt,
    ctaLabel: contactPageContent.visitUs.ctaLabel,
  };

  if (!section || section.showField === false) {
    return fallback;
  }

  const sectionImage = mapImageAsset(section.image);
  const showroomImage = mapShowroomVisitImage(section.showrooms);

  const desktopUrl =
    sectionImage.desktopUrl ??
    showroomImage.desktopUrl ??
    sectionImage.mobileUrl ??
    showroomImage.mobileUrl;
  const mobileUrl =
    sectionImage.mobileUrl ??
    showroomImage.mobileUrl ??
    sectionImage.desktopUrl ??
    showroomImage.desktopUrl;

  const imageSrc = desktopUrl ?? mobileUrl ?? fallback.imageSrc;
  const ctaLabel = cleanText(section.cta?.label) ?? fallback.ctaLabel;
  const ctaUrl = cleanText(section.cta?.url);

  return {
    title: cleanText(section.sectionTitle) ?? fallback.title,
    description: cleanText(section.description) ?? fallback.description,
    imageSrc,
    mobileImageSrc: mobileUrl ?? fallback.mobileImageSrc,
    imageAlt: sectionImage.alt ?? showroomImage.alt ?? "",
    ctaLabel,
    ...(ctaUrl ? { ctaUrl } : {}),
  };
};

const mapShowroomVisitImage = (
  showrooms?: StrapiContactVisitShowroom[] | null,
): { desktopUrl?: string; mobileUrl?: string; alt?: string } => {
  const active = (showrooms ?? []).filter(
    (showroom) => showroom && showroom.isActive !== false,
  );

  for (const showroom of active) {
    const mapped = mapImageAsset(showroom.image);
    if (mapped.desktopUrl || mapped.mobileUrl) {
      return {
        ...mapped,
        alt:
          mapped.alt ??
          cleanText(showroom.name) ??
          undefined,
      };
    }
  }

  return {};
};

const mapSeo = (seo?: StrapiContactSeo | null): NormalizedContactSeo | null => {
  if (!seo || seo.showField === false) return null;

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
      : "/contact",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

export function mapContactPage(raw?: StrapiContactPage | null): NormalizedContactPage {
  const introText = cleanText(raw?.introText);

  return {
    hero: mapHero(raw?.heroSection),
    intro: {
      description: introText ?? contactPageContent.intro.description,
      mobileDescription: introText ?? contactPageContent.intro.mobileDescription,
    },
    infoCards: mapInfoCards(raw?.contactSection),
    form: mapForm(raw?.formSection),
    visitUs: mapVisitUs(raw?.visitSection),
    seo: mapSeo(raw?.seo),
  };
}

/** Static defaults when CMS is unavailable (e.g. Public role 403). */
export const EMPTY_CONTACT_PAGE: NormalizedContactPage = mapContactPage(null);
