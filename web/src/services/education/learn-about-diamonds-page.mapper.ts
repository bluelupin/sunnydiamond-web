import {
  educationDiscoverContent,
  educationFaqItems,
  educationHeroFigmaSpec,
  educationPageImages,
} from "@/features/education/data/content";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  NormalizedEducationCtaBanner,
  NormalizedEducationFaqItem,
  NormalizedEducationFaqSection,
  NormalizedEducationHero,
  NormalizedLearnAboutDiamondsPage,
  StrapiEducationCtaBanner,
  StrapiEducationFaqItem,
  StrapiEducationHero,
  StrapiEducationResponsiveImage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";
import { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const mapPosterUrls = (image?: StrapiEducationResponsiveImage | null) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ??
    resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ??
    resolveCmsMediaUrl(image?.desktopImage);

  return {
    desktopUrl: desktopUrl ?? educationPageImages.heroDesktop,
    mobileUrl: mobileUrl ?? educationPageImages.heroMobile,
    alt:
      cleanText(image?.altText) ??
      cleanText(image?.caption) ??
      educationHeroFigmaSpec.image.alt,
  };
};

const mapBackgroundUrls = (image?: StrapiEducationResponsiveImage | null) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ??
    resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ??
    resolveCmsMediaUrl(image?.desktopImage);

  const hasCmsBackgroundImage = Boolean(desktopUrl || mobileUrl);

  return {
    desktopUrl: desktopUrl ?? educationPageImages.discoverImage,
    mobileUrl: mobileUrl ?? educationPageImages.discoverImage,
    alt: cleanText(image?.altText) ?? cleanText(image?.caption) ?? "",
    hasCmsBackgroundImage,
  };
};

const mapHero = (hero?: StrapiEducationHero | null): NormalizedEducationHero => {
  if (hero?.isActive === false) {
    return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE.hero;
  }

  const poster = mapPosterUrls(hero?.image);
  const videoUrl = resolveCmsMediaUrl(hero?.heroVideo?.heroVideo);

  return {
    title: cleanText(hero?.title) ?? educationHeroFigmaSpec.title.text,
    eyebrow: cleanText(hero?.eyebrow),
    subtitle: cleanText(hero?.subtitle),
    videoUrl,
    posterDesktopUrl: poster.desktopUrl,
    posterMobileUrl: poster.mobileUrl,
    posterAlt: poster.alt,
  };
};

const mapFaqItems = (items?: StrapiEducationFaqItem[] | null): NormalizedEducationFaqItem[] => {
  const mapped =
    items
      ?.map((item, index) => {
        const question = cleanText(item.question);
        const answer = cleanText(item.answer);
        if (!question) return null;

        return {
          id: item.id != null ? String(item.id) : `faq-${index}`,
          question,
          answer: answer ?? "",
        };
      })
      .filter((item): item is NormalizedEducationFaqItem => item != null) ?? [];

  if (mapped.length) return mapped;

  return educationFaqItems.map(({ id, question, answer }) => ({
    id,
    question,
    answer: answer ?? "",
  }));
};

const mapFaqSection = (
  faqSection?: StrapiLearnAboutDiamondsPageEntity["faqSection"],
): NormalizedEducationFaqSection => ({
  heading: cleanText(faqSection?.sectionHeading) ?? "Frequently Asked Questions",
  items: mapFaqItems(faqSection?.faqItems),
});

const mapCtaBanner = (
  ctaBanner?: StrapiEducationCtaBanner | null,
): NormalizedEducationCtaBanner => {
  const background = mapBackgroundUrls(ctaBanner?.backgroundImage);

  return {
    heading: cleanText(ctaBanner?.heading) ?? educationDiscoverContent.title,
    subheading:
      cleanText(ctaBanner?.subheading) ?? educationDiscoverContent.description,
    ctaLabel:
      cleanText(ctaBanner?.ctaButtonLabel) ?? educationDiscoverContent.ctaLabel,
    ctaHref:
      cleanText(ctaBanner?.ctaButtonUrl) ?? educationDiscoverContent.ctaHref,
    imageDesktopUrl: background.desktopUrl,
    imageMobileUrl: background.mobileUrl,
    imageAlt: background.alt,
    hasCmsBackgroundImage: background.hasCmsBackgroundImage,
  };
};

export function mapLearnAboutDiamondsPage(
  raw?: StrapiLearnAboutDiamondsPageEntity | null,
): NormalizedLearnAboutDiamondsPage {
  if (!raw) return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;

  return {
    hero: mapHero(raw.hero),
    faq: mapFaqSection(raw.faqSection),
    ctaBanner: mapCtaBanner(raw.ctaBanner),
  };
}
