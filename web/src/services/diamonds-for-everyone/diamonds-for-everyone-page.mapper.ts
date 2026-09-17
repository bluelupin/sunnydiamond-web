import {
  extractStrapiImage,
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";
import {
  EMPTY_DIAMONDS_FOR_EVERYONE_PAGE,
  type NormalizedDfeBenefitStep,
  type NormalizedDfeBenefits,
  type NormalizedDfeCta,
  type NormalizedDfeFaq,
  type NormalizedDfeHero,
  type NormalizedDfeHeroImage,
  type NormalizedDfeInvestmentPlanner,
  type NormalizedDfePlanIntro,
  type NormalizedDfeResponsiveImage,
  type NormalizedDfeSeo,
  type NormalizedDiamondsForEveryonePage,
  type StrapiDfeBenefitsSection,
  type StrapiDfeCta,
  type StrapiDfeFaqSection,
  type StrapiDfeHeroSection,
  type StrapiDfeInvestmentPlannerSection,
  type StrapiDfePlanIntroSection,
  type StrapiDfeResponsiveImage,
  type StrapiDfeSeo,
  type StrapiDiamondsForEveryonePage,
} from "./diamonds-for-everyone-page.types";

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

const mapHeroImage = (
  image?: StrapiDfeResponsiveImage | null,
): NormalizedDfeHeroImage | null => {
  const desktopFile = extractStrapiImage(image?.desktopImage);
  const mobileFile = extractStrapiImage(image?.mobileImage);
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ?? resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ?? resolveCmsMediaUrl(image?.desktopImage);
  if (!desktopUrl && !mobileUrl) return null;

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt:
      cleanText(image?.altText) ??
      resolveCmsAltText(image?.desktopImage) ??
      resolveCmsAltText(image?.mobileImage) ??
      "",
    width: desktopFile?.width ?? mobileFile?.width ?? undefined,
    height: desktopFile?.height ?? mobileFile?.height ?? undefined,
  };
};

const mapResponsiveImage = (
  image?: StrapiDfeResponsiveImage | null,
): NormalizedDfeResponsiveImage | null => {
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

const mapCta = (cta?: StrapiDfeCta | null): NormalizedDfeCta | null => {
  const label = cleanText(cta?.label);
  const url = cleanText(cta?.url);
  if (!label || !url) return null;
  return { label, url };
};

const mapSeo = (seo?: StrapiDfeSeo | null): NormalizedDfeSeo | null => {
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

const mapHero = (hero?: StrapiDfeHeroSection | null): NormalizedDfeHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  return {
    title,
    eyebrow: cleanText(hero.eyebrow),
    image: mapHeroImage(hero.backgroundImage),
  };
};

const mapPlanIntro = (
  section?: StrapiDfePlanIntroSection | null,
): NormalizedDfePlanIntro | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const description = cleanText(section.description);

  return {
    title,
    ...(description ? { description } : {}),
    backgroundImage: mapResponsiveImage(section.backgroundImage),
    textureImage: mapResponsiveImage(section.textureImage),
  };
};

const mapInvestmentPlanner = (
  section?: StrapiDfeInvestmentPlannerSection | null,
): NormalizedDfeInvestmentPlanner | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const description = cleanText(section.description);
  const monthlySummary = cleanText(section.monthlySummary);
  const buttonLabel = cleanText(section.buttonLabel);

  return {
    title,
    ...(description ? { description } : {}),
    ...(monthlySummary ? { monthlySummary } : {}),
    ...(buttonLabel ? { buttonLabel } : {}),
    cta: mapCta(section.cta),
    image: mapResponsiveImage(section.image),
  };
};

const resolveStepTitle = (label: string | undefined): string | undefined => {
  const cleaned = cleanText(label);
  if (!cleaned || /^\d+$/.test(cleaned)) return undefined;
  return cleaned;
};

const mapBenefits = (
  section?: StrapiDfeBenefitsSection | null,
): NormalizedDfeBenefits | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const steps: NormalizedDfeBenefitStep[] = (section.steps ?? [])
    .filter((step) => resolveSectionActive(step?.isActive, step?.showField))
    .map((step, index) => {
      const description = cleanText(step?.description);
      if (!description) return null;

      const label = cleanText(step?.label);
      const title = resolveStepTitle(label);

      return {
        id: step?.id != null ? String(step.id) : `step-${index + 1}`,
        stepNumber: index + 1,
        ...(title ? { title } : {}),
        description,
        ...(cleanText(step?.highlightedText)
          ? { highlightedText: cleanText(step.highlightedText) }
          : {}),
      };
    })
    .filter((step): step is NormalizedDfeBenefitStep => step != null);

  return {
    title,
    eyebrow: cleanText(section.eyebrow),
    subtitle: cleanText(section.subtitle),
    steps,
    backgroundImage: mapResponsiveImage(section.backgroundImage),
    cta: mapCta(section.cta),
  };
};

const mapFaq = (section?: StrapiDfeFaqSection | null): NormalizedDfeFaq | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.sectionHeading);
  const items = (section.faqItems ?? [])
    .filter((item) => resolveSectionActive(item?.isActive, item?.showField))
    .map((item, index) => {
      const question = cleanText(item?.question);
      const answer = cleanText(item?.answer);
      if (!question || !answer) return null;
      return {
        id: item?.id != null ? String(item.id) : `faq-${index + 1}`,
        question,
        answer,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (!title || items.length === 0) return null;

  return { title, items };
};

export function mapDiamondsForEveryonePage(
  raw?: StrapiDiamondsForEveryonePage | null,
): NormalizedDiamondsForEveryonePage {
  if (!raw) return EMPTY_DIAMONDS_FOR_EVERYONE_PAGE;

  return {
    hero: mapHero(raw.heroSection),
    planIntro: mapPlanIntro(raw.planIntroSection),
    investmentPlanner: mapInvestmentPlanner(raw.investmentPlannerSection),
    benefits: mapBenefits(raw.benefitsSection),
    faq: mapFaq(raw.faqSection),
    seo: mapSeo(raw.seo),
  };
}
