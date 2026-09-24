import {
  extractStrapiImage,
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";
import type {
  NormalizedBespokeCustomDesignForm,
  NormalizedBespokeFeaturedSlide,
  NormalizedBespokeFeaturedStories,
  NormalizedBespokeGetInTouch,
  NormalizedBespokeGuarantee,
  NormalizedBespokeHero,
  NormalizedBespokePastCreationImage,
  NormalizedBespokePastCreations,
  NormalizedBespokeResponsiveImage,
  NormalizedBespokeSeo,
  NormalizedBespokeStory,
  NormalizedBespokeStoryStep,
  NormalizedContactBespokePage,
  StrapiBespokeCustomDesignForm,
  StrapiBespokeFeaturedStoriesSection,
  StrapiBespokeFeaturedStoryCard,
  StrapiBespokeGetInTouchSection,
  StrapiBespokeHero,
  StrapiBespokePastCreation,
  StrapiBespokeResponsiveImage,
  StrapiBespokeSeo,
  StrapiBespokeServiceHighlight,
  StrapiBespokeVisionSection,
  StrapiContactBespokePageEntity,
} from "./contact-bespoke-page.types";
import { EMPTY_CONTACT_BESPOKE_PAGE } from "./contact-bespoke-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const withRequiredAsterisk = (label: string, required: boolean): string => {
  const base = label.replace(/\*+$/, "").trim();
  return required ? `${base}*` : base;
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
  media?: StrapiBespokeResponsiveImage | null,
): NormalizedBespokeResponsiveImage | null => {
  const desktopUrl =
    resolveCmsMediaUrl(media?.desktopImage) ?? resolveCmsMediaUrl(media?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(media?.mobileImage) ?? resolveCmsMediaUrl(media?.desktopImage);

  if (!desktopUrl && !mobileUrl) {
    return null;
  }

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt: resolveCmsAltText(media?.desktopImage) ?? resolveCmsAltText(media?.mobileImage) ?? "",
  };
};

const mapSeo = (seo?: StrapiBespokeSeo | null): NormalizedBespokeSeo | null => {
  const metaTitle = cleanText(seo?.metaTitle);
  const metaDescription = cleanText(seo?.metaDescription);
  const rawCanonical = cleanText(seo?.canonicalUrl);

  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo?.ogImage);

  return {
    metaTitle: metaTitle ?? "",
    metaDescription: metaDescription ?? "",
    canonicalPath: rawCanonical ?? "/bespoke-jewellery",
    metaKeywords: cleanText(seo?.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiBespokeHero | null): NormalizedBespokeHero | null => {
  if (!hero || hero.showField === false) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const image = mapResponsiveImage(hero.backgroundImage);

  return { title, image };
};

const resolveVisionCardVideoUrl = (card: {
  video?: { heroVideo?: unknown } | null;
}): string | undefined =>
  resolveCmsMediaUrl(card.video?.heroVideo) ?? resolveCmsMediaUrl(card.video);

const mapStory = (section?: StrapiBespokeVisionSection | null): NormalizedBespokeStory | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const cmsCards = (section.cards ?? []).filter((card) => card?.isActive !== false);

  const steps: NormalizedBespokeStoryStep[] = cmsCards
    .map((card) => {
      const stepTitle = cleanText(card.title);
      const stepNumber = cleanText(card.stepLabel);
      if (!stepTitle || !stepNumber) return null;

      const cmsImage =
        resolveCmsMediaUrl(card.image?.desktopImage) ??
        resolveCmsMediaUrl(card.image?.mobileImage) ??
        resolveCmsMediaUrl(card.media);

      if (!cmsImage) return null;

      const cardImage =
        card.image?.desktopImage ?? card.image?.mobileImage ?? card.media;
      const cardAlt = resolveCmsAltText(cardImage) ?? "";

      return {
        number: stepNumber,
        title: stepTitle,
        description: cleanText(card.description) ?? "",
        image: {
          src: cmsImage,
          alt: cardAlt,
        },
      };
    })
    .filter((step): step is NormalizedBespokeStoryStep => step != null);

  if (steps.length === 0) return null;

  const videoSrc =
    resolveCmsMediaUrl(section.video) ??
    resolveCmsMediaUrl(section.videoUrl?.heroVideo) ??
    cmsCards.map(resolveVisionCardVideoUrl).find((src): src is string => Boolean(src));

  const ctaLabel =
    cleanText(section.cta?.label) ?? cleanText(section.primaryCta?.label);

  return {
    title,
    subtitle: cleanText(section.description) ?? "",
    ...(videoSrc ? { videoSrc } : {}),
    steps,
    ...(ctaLabel ? { ctaLabel } : {}),
  };
};

const mapFeaturedCardToSlide = (
  card: StrapiBespokeFeaturedStoryCard,
  sectionCtaHref?: string,
): NormalizedBespokeFeaturedSlide | null => {
  if (card.isActive === false) return null;

  const coverUrl =
    resolveCmsMediaUrl(card.coverImage) ??
    resolveCmsMediaUrl(card.image?.desktopImage) ??
    resolveCmsMediaUrl(card.image?.mobileImage);

  if (!coverUrl) return null;

  const title = cleanText(card.title);
  if (!title) return null;

  const description = cleanText(card.description) ?? "";
  const coverFromCoverImage = resolveCmsMediaUrl(card.coverImage);
  const coverAlt = coverFromCoverImage
    ? resolveCmsAltText(card.coverImage) ?? ""
    : resolveCmsAltText(card.image?.desktopImage) ?? "";

  const galleryImages = (card.gallery ?? [])
    .map((item) => {
      const src = resolveCmsMediaUrl(item);
      if (!src) return null;
      return { src, alt: resolveCmsAltText(item) ?? "" };
    })
    .filter((item): item is { src: string; alt: string } => item != null);

  return {
    documentId: cleanText(card.documentId) || undefined,
    src: coverUrl,
    alt: coverAlt,
    modalTitle: title,
    modalDescription: description,
    modalImages: galleryImages.length > 0 ? galleryImages : [{ src: coverUrl, alt: coverAlt }],
    ...(sectionCtaHref ? { href: sectionCtaHref } : {}),
  };
};

const mapFeaturedStories = (
  section?: StrapiBespokeFeaturedStoriesSection | null,
): NormalizedBespokeFeaturedStories | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  const primaryCtaLabel = cleanText(section.cta?.label);
  const primaryCtaHref = cleanText(section.cta?.url);
  const secondaryCtaLabel = cleanText(section.secondaryCta?.label);
  const modalCtaLabel = cleanText(section.modalCta?.label);
  const backgroundImage = mapResponsiveImage(section.backgroundImage);

  const slides = (section.cards ?? [])
    .map((card) => mapFeaturedCardToSlide(card, primaryCtaHref))
    .filter((slide): slide is NormalizedBespokeFeaturedSlide => slide != null);

  if (!title && slides.length === 0 && !primaryCtaLabel && !backgroundImage) return null;

  return {
    title: title ?? "",
    defaultSlideIndex: slides.length > 2 ? 2 : 0,
    slides,
    backgroundImage,
    ...(primaryCtaLabel ? { primaryCtaLabel } : {}),
    ...(primaryCtaHref ? { primaryCtaHref } : {}),
    ...(secondaryCtaLabel ? { secondaryCtaLabel } : {}),
    ...(modalCtaLabel ? { modalCtaLabel } : {}),
  };
};

const mapMediaToPastCreationImage = (
  media: unknown,
  documentId?: string,
): NormalizedBespokePastCreationImage | null => {
  const file = extractStrapiImage(media);
  const src = resolveCmsMediaUrl(media);
  if (!src) return null;

  return {
    documentId: documentId || undefined,
    src,
    alt: resolveCmsAltText(media) ?? "",
    width: file?.width ?? 400,
    height: file?.height ?? 500,
  };
};

export const mapPastCreations = (
  items?: StrapiBespokePastCreation[] | null,
  title?: string,
): NormalizedBespokePastCreations | null => {
  const images: NormalizedBespokePastCreationImage[] = [];

  for (const item of items ?? []) {
    const documentId = cleanText(item.documentId) || undefined;
    const mediaList = item.gallery?.length ? item.gallery : [item.coverImage];

    for (const media of mediaList) {
      const mapped = mapMediaToPastCreationImage(media, documentId);
      if (!mapped) continue;
      images.push(mapped);
    }
  }

  if (images.length === 0 || !title) return null;

  return {
    title,
    images,
  };
};

const mapGuaranteeIcon = (
  highlight: StrapiBespokeServiceHighlight,
): { src: string; alt: string } | null => {
  const icon = highlight.icon;
  if (!icon || typeof icon !== "object") return null;

  let cmsUrl: string | null = null;
  let cmsAlt = "";

  if ("desktopImage" in icon || "mobileImage" in icon) {
    const responsive = icon as StrapiBespokeResponsiveImage;
    cmsUrl =
      resolveCmsMediaUrl(responsive.desktopImage) ??
      resolveCmsMediaUrl(responsive.mobileImage) ??
      null;
    cmsAlt = resolveCmsAltText(responsive.desktopImage) ?? "";
  } else {
    cmsUrl = resolveCmsMediaUrl(icon) ?? null;
    cmsAlt = resolveCmsAltText(icon) ?? "";
  }

  if (!cmsUrl) return null;

  const alt = cleanText(highlight.iconAltText) ?? cmsAlt;

  return {
    src: cmsUrl,
    alt,
  };
};

const mapGuarantees = (
  highlights?: StrapiBespokeServiceHighlight[] | null,
): NormalizedBespokeGuarantee[] => {
  return (highlights ?? [])
    .filter((item) => item?.isActive !== false)
    .map((item) => {
      const label = cleanText(item.label);
      const icon = mapGuaranteeIcon(item);
      if (!label || !icon) return null;
      return {
        label,
        iconSrc: icon.src,
        alt: icon.alt || label,
      };
    })
    .filter((item): item is NormalizedBespokeGuarantee => item != null);
};

const mapGetInTouch = (
  section?: StrapiBespokeGetInTouchSection | null,
): NormalizedBespokeGetInTouch | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const image = mapResponsiveImage(section.backgroundImage);
  const description = cleanText(section.description);
  const ctaLabel = cleanText(section.cta?.label);
  const ctaHref = cleanText(section.cta?.url);

  return {
    id: "bespoke-interested",
    title,
    ...(description ? { description } : {}),
    ...(ctaLabel ? { ctaLabel } : {}),
    ...(ctaHref ? { ctaHref } : {}),
    ...(image ? { image } : {}),
  };
};

const mapCustomDesignForm = (
  form?: StrapiBespokeCustomDesignForm | null,
): NormalizedBespokeCustomDesignForm | null => {
  if (!form || form.showField === false) return null;

  const title = cleanText(form.title);
  const fullNameLabel = cleanText(form.fullNameLabel);
  const phoneLabel = cleanText(form.phoneLabel);
  const emailLabel = cleanText(form.emailLabel);
  const visionLabel = cleanText(form.visionLabel);
  const referenceImagePrompt = cleanText(form.referenceImagePrompt);
  const referenceImageButtonText = cleanText(form.referenceImageButtonText);
  const helperText = cleanText(form.helperText);
  const submitButtonText = cleanText(form.submitButtonText);

  if (
    !title ||
    !fullNameLabel ||
    !phoneLabel ||
    !emailLabel ||
    !visionLabel ||
    !referenceImagePrompt ||
    !referenceImageButtonText ||
    !helperText ||
    !submitButtonText
  ) {
    return null;
  }

  return {
    title,
    fullNameLabel: withRequiredAsterisk(fullNameLabel, true),
    phoneLabel: withRequiredAsterisk(phoneLabel, true),
    emailLabel: withRequiredAsterisk(emailLabel, true),
    visionLabel: withRequiredAsterisk(visionLabel, true),
    referenceImagePrompt,
    referenceImageButtonText,
    helperText,
    submitButtonText,
    dialogAriaLabel: title,
    successToast: {
      title,
      description: helperText,
    },
  };
};

export function mapContactBespokePage(
  raw?: StrapiContactBespokePageEntity | null,
): NormalizedContactBespokePage {
  if (!raw) {
    return EMPTY_CONTACT_BESPOKE_PAGE;
  }

  const pastCreationsTitle = cleanText(raw.featuredStoriesSection?.secondaryCta?.label);

  return {
    hero: mapHero(raw.hero),
    story: mapStory(raw.visionSection),
    featuredStories: mapFeaturedStories(raw.featuredStoriesSection),
    pastCreations: mapPastCreations(raw.pastCreations, pastCreationsTitle),
    guarantees: mapGuarantees(raw.serviceHighlights),
    interested: mapGetInTouch(raw.getInTouchSection),
    customDesignForm: mapCustomDesignForm(raw.customDesignForm),
    seo: mapSeo(raw.seo),
  };
}
