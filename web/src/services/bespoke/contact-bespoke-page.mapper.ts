import {
  bespokeMediaFallbacks,
  bespokeUiDefaults,
} from "./bespoke-fallbacks";
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

const mapResponsiveImage = (
  media?: StrapiBespokeResponsiveImage | null,
  fallback?: { desktop: string; mobile: string; alt: string },
): NormalizedBespokeResponsiveImage | null => {
  const desktopUrl =
    resolveCmsMediaUrl(media?.desktopImage) ?? resolveCmsMediaUrl(media?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(media?.mobileImage) ?? resolveCmsMediaUrl(media?.desktopImage);

  if (!desktopUrl && !mobileUrl) {
    if (!fallback) return null;
    return {
      desktopUrl: fallback.desktop,
      mobileUrl: fallback.mobile,
      alt: fallback.alt,
    };
  }

  const desktopFile = extractStrapiImage(media?.desktopImage);
  const mobileFile = extractStrapiImage(media?.mobileImage);

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt:
      cleanText(media?.altText) ??
      cleanText(media?.caption) ??
      cleanText(desktopFile?.alternativeText) ??
      cleanText(mobileFile?.alternativeText) ??
      fallback?.alt ??
      "",
  };
};

const mapSeo = (seo?: StrapiBespokeSeo | null): NormalizedBespokeSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  return {
    metaTitle: metaTitle ?? "Bespoke Jewellery",
    metaDescription: metaDescription ?? "",
    canonicalPath: cleanText(seo.canonicalUrl) ?? "/bespoke-jewellery",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiBespokeHero | null): NormalizedBespokeHero | null => {
  if (!hero || hero.showField === false) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const image = mapResponsiveImage(hero.backgroundImage, bespokeMediaFallbacks.hero);
  if (!image) return null;

  return { title, image };
};

const mapStory = (section?: StrapiBespokeVisionSection | null): NormalizedBespokeStory | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const cmsCards = (section.cards ?? [])
    .filter((card) => card?.isActive !== false)
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const steps: NormalizedBespokeStoryStep[] = cmsCards
    .map((card, index) => {
      const stepTitle = cleanText(card.title);
      if (!stepTitle) return null;

      const cmsImage =
        resolveCmsMediaUrl(card.image?.desktopImage) ??
        resolveCmsMediaUrl(card.image?.mobileImage) ??
        resolveCmsMediaUrl(card.media);

      const mediaFallback = bespokeMediaFallbacks.storySteps[index] ?? bespokeMediaFallbacks.storySteps[0];

      return {
        number: cleanText(card.stepLabel) ?? String(index + 1).padStart(2, "0"),
        title: stepTitle,
        description: cleanText(card.description) ?? "",
        image: {
          src: cmsImage ?? mediaFallback.src,
          alt:
            cleanText(card.image?.altText) ??
            resolveCmsAltText(card.media) ??
            mediaFallback.alt,
        },
      };
    })
    .filter((step): step is NormalizedBespokeStoryStep => step != null);

  if (steps.length === 0) return null;

  const videoSrc =
    resolveCmsMediaUrl(section.video) ??
    resolveCmsMediaUrl(section.videoUrl?.heroVideo) ??
    bespokeMediaFallbacks.storyVideo;

  return {
    title,
    subtitle: cleanText(section.description) ?? "",
    videoSrc,
    steps,
    ctaLabel: cleanText(section.cta?.label) ?? "",
  };
};

const mapFeaturedCardToSlide = (
  card: StrapiBespokeFeaturedStoryCard,
  index: number,
): NormalizedBespokeFeaturedSlide | null => {
  if (card.isActive === false) return null;

  const coverUrl =
    resolveCmsMediaUrl(card.coverImage) ??
    resolveCmsMediaUrl(card.image?.desktopImage) ??
    resolveCmsMediaUrl(card.image?.mobileImage);

  if (!coverUrl) return null;

  const title = cleanText(card.title) ?? `Featured Story ${index + 1}`;
  const description = cleanText(card.description) ?? "";
  const coverAlt =
    resolveCmsAltText(card.coverImage) ?? cleanText(card.image?.altText) ?? title;

  const galleryImages = (card.gallery ?? [])
    .map((item) => {
      const src = resolveCmsMediaUrl(item);
      if (!src) return null;
      return { src, alt: resolveCmsAltText(item) ?? title };
    })
    .filter((item): item is { src: string; alt: string } => item != null);

  return {
    src: coverUrl,
    alt: coverAlt,
    modalTitle: title,
    modalDescription: description,
    modalImages: galleryImages.length > 0 ? galleryImages : [{ src: coverUrl, alt: coverAlt }],
  };
};

const mapFeaturedStories = (
  section?: StrapiBespokeFeaturedStoriesSection | null,
): NormalizedBespokeFeaturedStories | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  const slides = (section.cards ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapFeaturedCardToSlide)
    .filter((slide): slide is NormalizedBespokeFeaturedSlide => slide != null);

  const backgroundImage = mapResponsiveImage(section.backgroundImage);

  const primaryCtaLabel = cleanText(section.cta?.label) ?? "";
  const secondaryCtaLabel =
    cleanText(section.secondaryCta?.label) ?? bespokeUiDefaults.secondaryCtaLabel;

  // Keep section if we have a title, backdrop, slides, or any CTA — slides may be empty until CMS cards are added.
  if (!title && slides.length === 0 && !primaryCtaLabel && !backgroundImage) return null;

  return {
    title: title ?? "",
    defaultSlideIndex: slides.length > 2 ? 2 : 0,
    slides,
    backgroundImage,
    primaryCtaLabel,
    primaryCtaHref: cleanText(section.cta?.url) ?? "/featured-stories",
    secondaryCtaLabel,
    modalCtaLabel: bespokeUiDefaults.modalCtaLabel,
    modalCtaHref: bespokeUiDefaults.modalCtaHref,
  };
};

const mapMediaToPastCreationImage = (
  media: unknown,
  fallbackAlt: string,
): NormalizedBespokePastCreationImage | null => {
  const file = extractStrapiImage(media);
  const src = resolveCmsMediaUrl(media);
  if (!src) return null;

  return {
    src,
    alt: resolveCmsAltText(media) ?? fallbackAlt,
    width: file?.width ?? 400,
    height: file?.height ?? 500,
  };
};

const mapPastCreations = (
  items?: StrapiBespokePastCreation[] | null,
): NormalizedBespokePastCreations | null => {
  const images: NormalizedBespokePastCreationImage[] = [];
  const seenUrls = new Set<string>();

  for (const item of items ?? []) {
    const alt = cleanText(item.title) ?? "Past creation";
    const mediaList = [item.coverImage, ...(item.gallery ?? [])];

    for (const media of mediaList) {
      const mapped = mapMediaToPastCreationImage(media, alt);
      if (!mapped || seenUrls.has(mapped.src)) continue;
      seenUrls.add(mapped.src);
      images.push(mapped);
    }
  }

  if (images.length === 0) return null;

  return {
    title: bespokeUiDefaults.pastCreationsTitle,
    images,
  };
};

const mapGuaranteeIconSrc = (highlight: StrapiBespokeServiceHighlight): string | null => {
  const icon = highlight.icon;
  if (!icon || typeof icon !== "object") return null;

  if ("desktopImage" in icon || "mobileImage" in icon) {
    const responsive = icon as StrapiBespokeResponsiveImage;
    return (
      resolveCmsMediaUrl(responsive.desktopImage) ??
      resolveCmsMediaUrl(responsive.mobileImage) ??
      null
    );
  }

  return resolveCmsMediaUrl(icon) ?? null;
};

const mapGuarantees = (
  highlights?: StrapiBespokeServiceHighlight[] | null,
): NormalizedBespokeGuarantee[] => {
  return (highlights ?? [])
    .filter((item) => item?.isActive !== false)
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => {
      const label = cleanText(item.label);
      const iconSrc = mapGuaranteeIconSrc(item);
      if (!label || !iconSrc) return null;
      return {
        label,
        iconSrc,
      };
    })
    .filter((item): item is NormalizedBespokeGuarantee => item != null);
};

const mapGetInTouch = (
  section?: StrapiBespokeGetInTouchSection | null,
): NormalizedBespokeGetInTouch | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const image = mapResponsiveImage(section.backgroundImage, bespokeMediaFallbacks.interested);
  if (!image) return null;

  return {
    id: "bespoke-interested",
    title,
    description: cleanText(section.description) ?? "",
    ctaLabel: cleanText(section.cta?.label) ?? "",
    ctaHref: cleanText(section.cta?.url) ?? "/contact",
    image,
  };
};

const mapCustomDesignForm = (
  form?: StrapiBespokeCustomDesignForm | null,
): NormalizedBespokeCustomDesignForm | null => {
  if (!form || form.showField === false) return null;

  const title = cleanText(form.title);
  if (!title) return null;

  return {
    title,
    fullNameLabel: withRequiredAsterisk(cleanText(form.fullNameLabel) ?? "Full Name", true),
    phoneLabel: withRequiredAsterisk(cleanText(form.phoneLabel) ?? "Phone No.", true),
    emailLabel: withRequiredAsterisk(cleanText(form.emailLabel) ?? "Email ID", true),
    visionLabel: withRequiredAsterisk(cleanText(form.visionLabel) ?? "Describe your vision", true),
    visionPlaceholder: bespokeUiDefaults.visionPlaceholder,
    referenceImagePrompt:
      cleanText(form.referenceImagePrompt) ?? "Do you have any reference image? (Optional)",
    referenceImageButtonText: cleanText(form.referenceImageButtonText) ?? "Attach Image",
    helperText:
      cleanText(form.helperText) ?? "Our representative will get in touch with you soon",
    submitButtonText: cleanText(form.submitButtonText) ?? "Confirm Visit",
    closeAriaLabel: bespokeUiDefaults.formCloseAriaLabel,
    dialogAriaLabel: title,
    successToast: { ...bespokeUiDefaults.formSuccessToast },
  };
};

export function mapContactBespokePage(
  raw?: StrapiContactBespokePageEntity | null,
): NormalizedContactBespokePage {
  if (!raw) {
    return EMPTY_CONTACT_BESPOKE_PAGE;
  }

  return {
    hero: mapHero(raw.hero),
    story: mapStory(raw.visionSection),
    featuredStories: mapFeaturedStories(raw.featuredStoriesSection),
    pastCreations: mapPastCreations(raw.pastCreations),
    guarantees: mapGuarantees(raw.serviceHighlights),
    interested: mapGetInTouch(raw.getInTouchSection),
    customDesignForm: mapCustomDesignForm(raw.customDesignForm),
    seo: mapSeo(raw.seo),
  };
}
