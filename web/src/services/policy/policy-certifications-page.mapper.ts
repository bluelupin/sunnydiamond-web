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
  StrapiLegalPage,
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

function sortByOrder<T extends { sortOrder?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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

function stripMarkdownLight(value: string): string {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function mapLegalBodyToSections(legal: StrapiLegalPage): PolicyAccordionSection[] {
  const body = cleanText(legal.body);
  const summary = cleanText(legal.summary);
  if (!body && !summary) return [];

  if (!body) {
    return [
      {
        id: `${legal.slug ?? "legal"}-summary`,
        title: cleanText(legal.title) ?? "Overview",
        body: summary,
      },
    ];
  }

  const parts = body.split(/\n(?=##\s+)/);
  const intro = parts[0]?.startsWith("## ") ? "" : (parts[0] ?? "");
  const sectionParts = parts[0]?.startsWith("## ") ? parts : parts.slice(1);
  const sections: PolicyAccordionSection[] = [];

  if (summary || cleanText(intro)) {
    sections.push({
      id: `${legal.slug ?? "legal"}-overview`,
      title: "Overview",
      ...(summary ? { intro: summary } : {}),
      ...(cleanText(intro) ? { body: stripMarkdownLight(intro) } : {}),
    });
  }

  for (const part of sectionParts) {
    const match = part.match(/^##\s+(.+?)(?:\n|$)([\s\S]*)$/);
    if (!match) continue;
    const title = stripMarkdownLight(match[1]);
    const content = stripMarkdownLight(match[2] ?? "");
    if (!title || !content) continue;
    sections.push({
      id: slugify(title),
      title,
      body: content,
    });
  }

  if (sections.length === 0) {
    sections.push({
      id: `${legal.slug ?? "legal"}-body`,
      title: cleanText(legal.title) ?? "Details",
      body: stripMarkdownLight(body),
    });
  }

  return sections;
}

function mapCmsPolicyToDocument(
  policy: StrapiPolicy,
  legalBySlug: Map<string, StrapiLegalPage>,
): PolicyDocument | null {
  const slug = cleanText(policy.slug);
  const title = cleanText(policy.title);
  if (!slug || !title || policy.isActive === false) return null;

  const accordionSections = sortByOrder(policy.accordionItems ?? [])
    .map((item, index) => parseAnswerToSection(item, index))
    .filter((section): section is PolicyAccordionSection => Boolean(section));

  const legal = legalBySlug.get(slug);
  const legalSections = legal ? mapLegalBodyToSections(legal) : [];

  return {
    id: slug,
    navLabel: toNavLabel(title),
    contentTitle: title,
    sections: accordionSections.length > 0 ? accordionSections : legalSections,
  };
}

function mapSupport(
  options: StrapiPolicyContactOption[] | null | undefined,
): PolicySupportContent {
  const active = sortByOrder(
    (options ?? []).filter((option) => option.isActive !== false),
  );

  const phone = active.find((option) => cleanText(option.type)?.toLowerCase() === "phone");
  const email = active.find((option) => cleanText(option.type)?.toLowerCase() === "email");

  const phoneValue = cleanText(phone?.value) ?? "";
  const emailValue = cleanText(email?.value) ?? "";
  const phoneDigits = phoneValue.replace(/[^\d+]/g, "");

  return {
    callTitle: cleanText(phone?.heading) ?? "Call Us",
    emailTitle: cleanText(email?.heading) ?? "Email Us",
    emailDescription: cleanText(email?.description) ?? "",
    contactCtaLabel: cleanText(phone?.buttonLabel) ?? "CONTACT US",
    contactHref: "/contact",
    emailCtaLabel: cleanText(email?.buttonLabel) ?? "SEND AN EMAIL",
    emailHref: emailValue ? `mailto:${emailValue}` : "",
    phoneLabel: phoneValue,
    phoneHref: phoneDigits ? `tel:${phoneDigits}` : "",
    emailLabel: emailValue,
    hours: parseAvailabilityHours(phone?.availability),
  };
}

function mapSeo(seo: StrapiPolicySeo | null | undefined): PolicyPageSeo | null {
  if (!seo) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const canonicalUrl = cleanText(seo.canonicalUrl);
  const keywords = cleanText(seo.metaKeywords);
  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  if (!metaTitle && !metaDescription && !canonicalUrl && !keywords && !ogImageUrl) return null;

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
  pageTitle: "Policy & Certifications",
  searchPlaceholder: "Search keywords",
  emptySearchLabel: "No matching policies found.",
  support: {
    callTitle: "Call Us",
    emailTitle: "Email Us",
    emailDescription: "",
    contactCtaLabel: "CONTACT US",
    contactHref: "/contact",
    emailCtaLabel: "SEND AN EMAIL",
    emailHref: "",
    phoneLabel: "",
    phoneHref: "",
    emailLabel: "",
    hours: [],
  },
  navGroups: [],
  defaultPolicyId: "privacy-policy",
  seo: null,
};

export function mapPolicyCertificationsPage(input: {
  landing: StrapiPolicyCertificationsPage | null;
  legalPages: StrapiLegalPage[];
}): NormalizedPolicyCertificationsPage {
  const landing = input.landing;
  if (!landing) {
    return EMPTY_POLICY_CERTIFICATIONS_PAGE;
  }

  const legalBySlug = new Map<string, StrapiLegalPage>();
  for (const page of input.legalPages) {
    const slug = cleanText(page.slug);
    if (!slug || page.isActive === false) continue;
    legalBySlug.set(slug, page);
  }

  const navGroups = sortByOrder(
    (landing.policyCategories ?? []).filter((category) => category.isActive !== false),
  )
    .map((category) => {
      const id = cleanText(category.slug);
      const label = cleanText(category.title);
      if (!id || !label) return null;

      const items = sortByOrder(category.policies ?? [])
        .map((policy) => mapCmsPolicyToDocument(policy, legalBySlug))
        .filter((policy): policy is PolicyDocument => Boolean(policy));

      if (!items.length) return null;

      return { id, label, items } satisfies PolicyNavGroup;
    })
    .filter((group): group is PolicyNavGroup => Boolean(group));

  const allPolicies = navGroups.flatMap((group) => group.items);
  const defaultPolicyId = allPolicies.some((policy) => policy.id === "privacy-policy")
    ? "privacy-policy"
    : (allPolicies[0]?.id ?? "privacy-policy");

  return {
    pageTitle:
      cleanText(landing.headerSection?.heading) ??
      EMPTY_POLICY_CERTIFICATIONS_PAGE.pageTitle,
    searchPlaceholder:
      cleanText(landing.headerSection?.searchPlaceholder) ??
      EMPTY_POLICY_CERTIFICATIONS_PAGE.searchPlaceholder,
    emptySearchLabel:
      cleanText(landing.headerSection?.emptySearchMessage) ??
      EMPTY_POLICY_CERTIFICATIONS_PAGE.emptySearchLabel,
    support: mapSupport(
      landing.contactSection?.isActive === false
        ? []
        : landing.contactSection?.contactOptions,
    ),
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
