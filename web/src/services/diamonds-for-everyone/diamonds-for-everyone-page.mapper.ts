import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  EMPTY_DIAMONDS_FOR_EVERYONE_PAGE,
  type NormalizedDfeBenefitStep,
  type NormalizedDfeBenefits,
  type NormalizedDfeCta,
  type NormalizedDfeEditorialBanner,
  type NormalizedDfeFaq,
  type NormalizedDfeHero,
  type NormalizedDfeInvestmentPlanner,
  type NormalizedDfePlanIntro,
  type NormalizedDfeResponsiveImage,
  type NormalizedDfeSeo,
  type NormalizedDiamondsForEveryonePage,
  type StrapiDfeBenefitsSection,
  type StrapiDfeCta,
  type StrapiDfeEditorialBannerSection,
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

const resolveSectionActive = (showField?: boolean | null): boolean => {
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapResponsiveImage = (
  image?: StrapiDfeResponsiveImage | null,
): NormalizedDfeResponsiveImage | null => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ?? resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ?? resolveCmsMediaUrl(image?.desktopImage);
  if (!desktopUrl && !mobileUrl) return null;

  return {
    desktopUrl: desktopUrl ?? "",
    mobileUrl: mobileUrl ?? "",
    alt: resolveCmsAltText(image?.desktopImage) ?? "",
  };
};

const mapCta = (cta?: StrapiDfeCta | null): NormalizedDfeCta | null => {
  const label = cleanText(cta?.label);
  const url = cleanText(cta?.url) ?? cleanText(cta?.to);
  if (!label || !url) return null;
  return { label, url };
};

const mapSeo = (seo?: StrapiDfeSeo | null): NormalizedDfeSeo | null => {
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
      : "/diamonds-for-everyone",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiDfeHeroSection | null): NormalizedDfeHero | null => {
  if (!hero || !resolveSectionActive(hero.showField)) return null;

  const title = cleanText(hero.title);
  const image = mapResponsiveImage(hero.backgroundImage);
  if (!title || !image) return null;

  return {
    title,
    eyebrow: cleanText(hero.eyebrow),
    image,
  };
};

const mapPlanIntro = (
  section?: StrapiDfePlanIntroSection | null,
): NormalizedDfePlanIntro | null => {
  if (!section || !resolveSectionActive(section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  return {
    title,
    description: cleanText(section.description),
    image: mapResponsiveImage(section.backgroundImage),
  };
};

const mapInvestmentPlanner = (
  section?: StrapiDfeInvestmentPlannerSection | null,
): NormalizedDfeInvestmentPlanner | null => {
  if (!section || !resolveSectionActive(section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const cta = mapCta(section.cta);

  return {
    title,
    description: cleanText(section.description),
    ctaLabel: cta?.label,
    image: mapResponsiveImage(section.image) ?? mapResponsiveImage(section.backgroundImage),
  };
};

const mapEditorialBanner = (
  section?: StrapiDfeEditorialBannerSection | null,
): NormalizedDfeEditorialBanner | null => {
  if (!section || !resolveSectionActive(section.showField)) return null;

  const image = mapResponsiveImage(section.image);
  if (!image) return null;

  return {
    image,
    cta: mapCta(section.cta),
  };
};

const parseStepNumber = (label: string | undefined, index: number): number => {
  if (!label) return index + 1;
  const digits = label.replace(/\D/g, "");
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
};

const mapBenefits = (
  section?: StrapiDfeBenefitsSection | null,
): NormalizedDfeBenefits | null => {
  if (!section || !resolveSectionActive(section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const steps: NormalizedDfeBenefitStep[] = (section.steps ?? [])
    .map((step, index) => {
      const description = cleanText(step?.description);
      if (!description) return null;
      return {
        id: step?.id != null ? String(step.id) : `step-${index + 1}`,
        stepNumber: parseStepNumber(cleanText(step?.label), index),
        description,
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
  if (!section) return null;

  const title = cleanText(section.sectionHeading);
  const items = (section.faqItems ?? [])
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
    editorialBanner: mapEditorialBanner(raw.editorialBannerSection),
    benefits: mapBenefits(raw.benefitsSection),
    faq: mapFaq(raw.faqSection),
    seo: mapSeo(raw.seo),
  };
}
