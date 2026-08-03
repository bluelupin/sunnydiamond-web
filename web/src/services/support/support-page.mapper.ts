import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  EMPTY_SUPPORT_PAGE,
  type NormalizedSupportContactOption,
  type NormalizedSupportCta,
  type NormalizedSupportFaqItem,
  type NormalizedSupportFaqSection,
  type NormalizedSupportPage,
  type NormalizedSupportSeo,
  type StrapiSupportContactOption,
  type StrapiSupportCta,
  type StrapiSupportFaqItem,
  type StrapiSupportFaqSection,
  type StrapiSupportPage,
  type StrapiSupportSeo,
} from "./support-page.types";

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

const mapCta = (cta?: StrapiSupportCta | null): NormalizedSupportCta | null => {
  const label = cleanText(cta?.label);
  const url = cleanText(cta?.url) ?? cleanText(cta?.to);
  if (!label || !url) return null;
  return { label, url };
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

const mapHours = (
  option: StrapiSupportContactOption,
): Array<{ label: string; value: string }> => {
  const hours = option.hours;
  if (hours) {
    if (typeof hours === "string") {
      return mapAvailabilityHours(hours);
    }
    if (Array.isArray(hours)) {
      return hours
        .map((item) => {
          const label = cleanText(item?.label) ?? "";
          const value = cleanText(item?.value);
          if (!value) return null;
          return { label, value };
        })
        .filter((item): item is { label: string; value: string } => item != null);
    }
  }

  return mapAvailabilityHours(option.availability);
};

const toTelHref = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : `tel:${phone}`;
};

const resolveContactValue = (
  option: StrapiSupportContactOption,
): { phone: string | null; email: string | null } => {
  const type = cleanText(option.type)?.toLowerCase();
  const value = cleanText(option.value) ?? null;
  const explicitPhone = cleanText(option.phone) ?? null;
  const explicitEmail = cleanText(option.email) ?? null;

  if (type === "phone") {
    return { phone: explicitPhone ?? value, email: explicitEmail };
  }
  if (type === "email") {
    return { phone: explicitPhone, email: explicitEmail ?? value };
  }

  if (explicitPhone || explicitEmail) {
    return { phone: explicitPhone, email: explicitEmail };
  }

  if (value?.includes("@")) {
    return { phone: null, email: value };
  }
  if (value) {
    return { phone: value, email: null };
  }

  return { phone: null, email: null };
};

const mapButtonCta = (
  option: StrapiSupportContactOption,
  phone: string | null,
  email: string | null,
): NormalizedSupportCta | null => {
  const fromStructured = mapCta(option.primaryCta ?? option.cta);
  if (fromStructured) return fromStructured;

  const label = cleanText(option.buttonLabel);
  if (!label) return null;

  if (phone) return { label, url: toTelHref(phone) };
  if (email) return { label, url: `mailto:${email}` };
  return null;
};

const mapContactOption = (
  option?: StrapiSupportContactOption | null,
): NormalizedSupportContactOption | null => {
  if (!option || !resolveSectionActive(option.isActive, option.showField)) {
    return null;
  }

  const title = cleanText(option.title) ?? cleanText(option.heading);
  if (!title) return null;

  const { phone, email } = resolveContactValue(option);

  return {
    id: option.id != null ? String(option.id) : title.toLowerCase().replace(/\s+/g, "-"),
    title,
    description: cleanText(option.description) ?? cleanText(option.body) ?? null,
    phone,
    phoneHref: phone ? toTelHref(phone) : null,
    email,
    emailHref: email ? `mailto:${email}` : null,
    hours: mapHours(option),
    cta: mapButtonCta(option, phone, email),
  };
};

const mapFaqItem = (item?: StrapiSupportFaqItem | null): NormalizedSupportFaqItem | null => {
  if (!item || !resolveSectionActive(item.isActive, item.showField)) return null;

  const question = cleanText(item.question);
  const answer = cleanText(item.answer);
  if (!question || !answer) return null;

  return {
    id: item.id != null ? String(item.id) : question.toLowerCase().replace(/\s+/g, "-"),
    question,
    answer,
  };
};

const mapFaqSection = (
  faqSection?: StrapiSupportFaqSection | null,
  fallbackItems?: StrapiSupportFaqItem[] | null,
): NormalizedSupportFaqSection | null => {
  const rawItems = faqSection?.faqItems ?? faqSection?.items ?? fallbackItems ?? [];
  // Preserve Strapi component order (drag-and-drop).
  const items = rawItems
    .map(mapFaqItem)
    .filter((item): item is NormalizedSupportFaqItem => item != null);

  if (faqSection && !resolveSectionActive(faqSection.isActive, faqSection.showField)) {
    return null;
  }

  if (items.length === 0) return null;

  return {
    title:
      cleanText(faqSection?.title) ??
      cleanText(faqSection?.sectionTitle) ??
      cleanText(faqSection?.sectionHeading) ??
      null,
    items,
  };
};

const mapSeo = (seo?: StrapiSupportSeo | null): NormalizedSupportSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: cleanText(seo.canonicalUrl) ?? "/faqs",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

export function mapSupportPage(raw?: StrapiSupportPage | null): NormalizedSupportPage {
  if (!raw) return EMPTY_SUPPORT_PAGE;

  const contactSection = raw.contactSection;
  const contactSectionActive = contactSection
    ? resolveSectionActive(contactSection.isActive, contactSection.showField)
    : true;

  const rawContactOptions = contactSectionActive
    ? (contactSection?.contactOptions ??
      raw.contactOptions ??
      raw.contactOption ??
      [])
    : [];

  // Preserve Strapi component order (drag-and-drop). Do not re-sort by
  // sortOrder — those numbers are often stale after drag and would undo the order.
  const contactOptions = rawContactOptions
    .map(mapContactOption)
    .filter((item): item is NormalizedSupportContactOption => item != null);

  const heroTitle = cleanText(raw.hero?.title);
  const heroSubtitle =
    cleanText(raw.hero?.subtitle) ?? cleanText(raw.hero?.description) ?? null;

  return {
    title:
      heroTitle ??
      cleanText(raw.title) ??
      cleanText(raw.sectionTitle) ??
      cleanText(contactSection?.heading) ??
      null,
    subtitle: heroSubtitle,
    contactOptions,
    faq: mapFaqSection(raw.faqSection, raw.faqs),
    seo: mapSeo(raw.seo),
  };
}
