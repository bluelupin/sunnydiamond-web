import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  PolicyAccordionSection,
  PolicyDocument,
  PolicyNavGroup,
} from "@/features/cms/data/policyCertificationsContent";
import type {
  NormalizedPolicyCertificationsPage,
  PolicyPageSeo,
  PolicySupportContent,
  StrapiPolicy,
  StrapiPolicyAccordionItem,
  StrapiPolicyCertificationsPage,
  StrapiPolicyContactOption,
  StrapiPolicySeo,
} from "./policy-certifications-page.types";

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** CMS sections may use `isActive` or `showField`; default visible when unset. */
function resolveSectionActive(
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
}

/** CMS drag order: sort by `sortOrder` when set; otherwise keep API array order. */
function sortByCmsOrder<T extends { sortOrder?: number | null; id?: number | string }>(
  items: T[],
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aOrder = a.item.sortOrder;
      const bOrder = b.item.sortOrder;
      const aHas = typeof aOrder === "number";
      const bHas = typeof bOrder === "number";
      if (aHas && bHas && aOrder !== bOrder) return aOrder - bOrder;
      if (aHas !== bHas) return aHas ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

function toNavLabel(title: string): string {
  return title.toUpperCase();
}

function parseAvailabilityHours(
  availability: string | null | undefined,
): Array<{ label: string; value: string }> {
  const raw = cleanText(availability);
  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.indexOf(":");
      if (colon === -1) {
        return { label: line, value: "" };
      }
      return {
        label: line.slice(0, colon).trim(),
        value: line.slice(colon + 1).trim(),
      };
    });
}

function parseAnswerToSection(
  item: StrapiPolicyAccordionItem,
  index: number,
): PolicyAccordionSection | null {
  if (!resolveSectionActive(item.isActive, item.showField)) return null;

  const title = cleanText(item.question);
  const answer = cleanText(item.answer);
  if (!title || !answer) return null;

  const lines = answer.split("\n").map((line) => line.trim()).filter(Boolean);
  const numbered = lines.filter((line) => /^\d+\.\s+/.test(line));

  if (numbered.length >= 2) {
    const introLines = lines.filter((line) => !/^\d+\.\s+/.test(line));
    return {
      id: item.id != null ? `accordion-${item.id}` : `accordion-${index}`,
      title,
      ...(introLines.length ? { intro: introLines.join("\n\n") } : {}),
      listItems: numbered.map((line) => line.replace(/^\d+\.\s+/, "").trim()),
    };
  }

  const paragraphs = answer.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    return {
      id: item.id != null ? `accordion-${item.id}` : `accordion-${index}`,
      title,
      intro: paragraphs[0],
      body: paragraphs.slice(1).join("\n\n"),
    };
  }

  return {
    id: item.id != null ? `accordion-${item.id}` : `accordion-${index}`,
    title,
    body: answer,
  };
}

function mapCmsPolicyToDocument(policy: StrapiPolicy): PolicyDocument | null {
  const slug = cleanText(policy.slug);
  const title = cleanText(policy.title);
  if (!slug || !title || !resolveSectionActive(policy.isActive, policy.showField)) {
    return null;
  }

  const sections = sortByCmsOrder(policy.accordionItems ?? [])
    .map((item, index) => parseAnswerToSection(item, index))
    .filter((section): section is PolicyAccordionSection => Boolean(section));

  // No static / legal-page content fallback — hide policies with no CMS accordion items.
  if (sections.length === 0) return null;

  return {
    id: slug,
    navLabel: toNavLabel(title),
    contentTitle: title,
    sections,
  };
}

function toTelHref(value: string): string {
  if (/^tel:/i.test(value)) return value;
  const digits = value.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

function toMailtoHref(value: string): string {
  if (/^mailto:/i.test(value)) return value;
  const email = value.replace(/^mailto:/i, "").trim();
  return email ? `mailto:${email}` : "";
}

function mapSupport(
  options: StrapiPolicyContactOption[] | null | undefined,
): PolicySupportContent {
  const active = sortByCmsOrder(options ?? []).filter((option) =>
    resolveSectionActive(option.isActive, option.showField),
  );

  const phone = active.find((option) => cleanText(option.type)?.toLowerCase() === "phone");
  const email = active.find((option) => cleanText(option.type)?.toLowerCase() === "email");

  const phoneLabel =
    cleanText(phone?.cta?.label) ??
    cleanText(phone?.buttonLabel) ??
    cleanText(phone?.value) ??
    "";
  const phoneUrl =
    cleanText(phone?.cta?.url) ?? cleanText(phone?.value) ?? "";
  const phoneHref = phoneUrl ? toTelHref(phoneUrl) : "";

  const emailLabel =
    cleanText(email?.cta?.label) ??
    cleanText(email?.buttonLabel) ??
    cleanText(email?.value) ??
    "";
  const emailUrl =
    cleanText(email?.cta?.url) ?? cleanText(email?.value) ?? "";
  const emailHref = emailUrl ? toMailtoHref(emailUrl) : "";

  return {
    callTitle: cleanText(phone?.heading) ?? "",
    emailTitle: cleanText(email?.heading) ?? "",
    emailDescription: cleanText(email?.description) ?? "",
    contactCtaLabel: phoneLabel,
    contactHref: phoneHref,
    emailCtaLabel: emailLabel,
    emailHref,
    phoneLabel,
    phoneHref,
    emailLabel,
    // CMS removed `availability`; Call Us hours now live on `description` (same key as email).
    hours: parseAvailabilityHours(phone?.description ?? phone?.availability),
  };
}

function mapSeo(seo: StrapiPolicySeo | null | undefined): PolicyPageSeo | null {
  if (!seo || !resolveSectionActive(seo.isActive, seo.showField)) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const canonicalUrl = cleanText(seo.canonicalUrl);
  const keywords = cleanText(seo.metaKeywords);
  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  if (!metaTitle && !metaDescription && !canonicalUrl && !keywords && !ogImageUrl) {
    return null;
  }

  let canonicalPath: string | undefined;
  if (canonicalUrl) {
    try {
      canonicalPath = new URL(canonicalUrl).pathname.replace(/\/$/, "") || undefined;
    } catch {
      canonicalPath = canonicalUrl.startsWith("/")
        ? canonicalUrl.replace(/\/$/, "") || undefined
        : undefined;
    }
  }

  return {
    ...(metaTitle ? { metaTitle } : {}),
    ...(metaDescription ? { metaDescription } : {}),
    ...(canonicalPath ? { canonicalPath } : {}),
    ...(keywords ? { keywords } : {}),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
}

export const EMPTY_POLICY_CERTIFICATIONS_PAGE: NormalizedPolicyCertificationsPage = {
  pageTitle: "",
  searchPlaceholder: "",
  emptySearchLabel: "",
  support: {
    callTitle: "",
    emailTitle: "",
    emailDescription: "",
    contactCtaLabel: "",
    contactHref: "",
    emailCtaLabel: "",
    emailHref: "",
    phoneLabel: "",
    phoneHref: "",
    emailLabel: "",
    hours: [],
  },
  navGroups: [],
  defaultPolicyId: "",
  seo: null,
};

export function mapPolicyCertificationsPage(
  landing: StrapiPolicyCertificationsPage | null,
): NormalizedPolicyCertificationsPage {
  if (!landing) {
    return EMPTY_POLICY_CERTIFICATIONS_PAGE;
  }

  const headerActive = resolveSectionActive(
    landing.headerSection?.isActive,
    landing.headerSection?.showField,
  );

  const navGroups = sortByCmsOrder(landing.policyCategories ?? [])
    .filter((category) => resolveSectionActive(category.isActive, category.showField))
    .map((category) => {
      const id = cleanText(category.slug);
      const label = cleanText(category.title);
      if (!id || !label) return null;

      const items = sortByCmsOrder(category.policies ?? [])
        .map((policy) => mapCmsPolicyToDocument(policy))
        .filter((policy): policy is PolicyDocument => Boolean(policy));

      if (!items.length) return null;

      return { id, label, items } satisfies PolicyNavGroup;
    })
    .filter((group): group is PolicyNavGroup => Boolean(group));

  const allPolicies = navGroups.flatMap((group) => group.items);
  const defaultPolicyId = allPolicies[0]?.id ?? "";

  const contactActive = resolveSectionActive(
    landing.contactSection?.isActive,
    landing.contactSection?.showField,
  );

  return {
    pageTitle: headerActive
      ? (cleanText(landing.headerSection?.heading) ?? "")
      : "",
    searchPlaceholder: headerActive
      ? (cleanText(landing.headerSection?.searchPlaceholder) ?? "")
      : "",
    emptySearchLabel: headerActive
      ? (cleanText(landing.headerSection?.emptySearchMessage) ?? "")
      : "",
    support: mapSupport(contactActive ? landing.contactSection?.contactOptions : []),
    navGroups,
    defaultPolicyId,
    seo: mapSeo(landing.seo),
  };
}

export function getPolicyFromPage(
  page: NormalizedPolicyCertificationsPage,
  policyId: string,
): PolicyDocument | undefined {
  return page.navGroups
    .flatMap((group) => group.items)
    .find((policy) => policy.id === policyId);
}
