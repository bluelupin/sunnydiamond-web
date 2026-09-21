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
  // CMS removed `availability`; Call Us hours now live on `description` (same as contact/policy).
  const fromDescription = mapAvailabilityHours(option.description);
  if (fromDescription.length > 0) {
    return fromDescription;
  }

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

const toMailtoHref = (email: string): string => {
  if (/^mailto:/i.test(email)) return email;
  return `mailto:${email}`;
};

const resolveContactValue = (
  option: StrapiSupportContactOption,
): {
  phone: string | null;
  email: string | null;
  phoneHref: string | null;
  emailHref: string | null;
} => {
  const type = cleanText(option.type)?.toLowerCase();
  const value = cleanText(option.value) ?? null;
  const explicitPhone = cleanText(option.phone) ?? null;
  const explicitEmail = cleanText(option.email) ?? null;
  // Live CMS: contact link lives on nested CTA (label + tel/mailto url).
  const cta = option.primaryCta ?? option.cta;
  const ctaUrl = cleanText(cta?.url) ?? cleanText(cta?.to);
  const ctaLabel = cleanText(cta?.label);

  let phone = explicitPhone;
  let email = explicitEmail;
  let phoneHref: string | null = null;
  let emailHref: string | null = null;

  if (type === "phone") {
    phone =
      phone ??
      value ??
      (ctaLabel && !ctaLabel.includes("@") ? ctaLabel.replace(/^tel:/i, "").trim() : null);
    if (ctaUrl && /^tel:/i.test(ctaUrl)) {
      phoneHref = ctaUrl;
    }
  } else if (type === "email") {
    email =
      email ??
      value ??
      (ctaLabel?.includes("@")
        ? ctaLabel.replace(/^mailto:/i, "").trim()
        : ctaUrl && /^mailto:/i.test(ctaUrl)
          ? ctaUrl.replace(/^mailto:/i, "").trim()
          : null);
    if (ctaUrl && /^mailto:/i.test(ctaUrl)) {
      emailHref = ctaUrl;
    }
  } else if (explicitPhone || explicitEmail) {
    // keep explicit
  } else if (value?.includes("@")) {
    email = value;
  } else if (value) {
    phone = value;
  } else if (ctaUrl && /^tel:/i.test(ctaUrl)) {
    phone = ctaLabel?.replace(/^tel:/i, "").trim() ?? ctaUrl.replace(/^tel:/i, "");
    phoneHref = ctaUrl;
  } else if (ctaUrl && /^mailto:/i.test(ctaUrl)) {
    email = ctaLabel?.replace(/^mailto:/i, "").trim() ?? ctaUrl.replace(/^mailto:/i, "");
    emailHref = ctaUrl;
  }

  return {
    phone,
    email,
    phoneHref: phoneHref ?? (phone ? toTelHref(phone) : null),
    emailHref: emailHref ?? (email ? toMailtoHref(email) : null),
  };
};

/** Outline button: `buttonLabel` + contact href. Nested CTA is the contact link, not this button. */
const mapButtonCta = (
  option: StrapiSupportContactOption,
  phone: string | null,
  email: string | null,
  phoneHref: string | null,
  emailHref: string | null,
): NormalizedSupportCta | null => {
  const label = cleanText(option.buttonLabel);
  if (label) {
    if (phone && phoneHref) return { label, url: phoneHref };
    if (email && emailHref) return { label, url: emailHref };
  }

  // Legacy fallback when CMS only provides structured CTA (no buttonLabel).
  return mapCta(option.primaryCta ?? option.cta);
};

const mapContactOption = (
  option?: StrapiSupportContactOption | null,
): NormalizedSupportContactOption | null => {
  if (!option || !resolveSectionActive(option.isActive, option.showField)) {
    return null;
  }

  const title = cleanText(option.title) ?? cleanText(option.heading);
  if (!title) return null;

  const { phone, email, phoneHref, emailHref } = resolveContactValue(option);

  return {
    id: option.id != null ? String(option.id) : title.toLowerCase().replace(/\s+/g, "-"),
    title,
    description: cleanText(option.description) ?? cleanText(option.body) ?? null,
    phone,
    phoneHref,
    email,
    emailHref,
    hours: mapHours(option),
    cta: mapButtonCta(option, phone, email, phoneHref, emailHref),
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
