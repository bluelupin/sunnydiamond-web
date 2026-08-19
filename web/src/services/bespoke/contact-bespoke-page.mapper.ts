import { bespokeUiDefaults } from "./bespoke-fallbacks";
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
      resolveCmsAltText(media?.desktopImage) ??
      resolveCmsAltText(media?.mobileImage) ??
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
    metaTitle: metaTitle ?? "",
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

  const image = mapResponsiveImage(hero.backgroundImage);
  if (!image) return null;

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

      if (!cmsImage) return null;

      return {
        number: cleanText(card.stepLabel) ?? String(index + 1).padStart(2, "0"),
        title: stepTitle,
        description: cleanText(card.description) ?? "",
        image: {
          src: cmsImage,
          alt:
            cleanText(card.image?.altText) ??
            resolveCmsAltText(card.media) ??
            stepTitle,
        },
      };
    })
    .filter((step): step is NormalizedBespokeStoryStep => step != null);

  if (steps.length === 0) return null;

  const videoSrc =
    resolveCmsMediaUrl(section.video) ??
    resolveCmsMediaUrl(section.videoUrl?.heroVideo) ??
    cmsCards.map(resolveVisionCardVideoUrl).find((src): src is string => Boolean(src)) ??
    "";

  return {
    title,
    subtitle: cleanText(section.description) ?? "",
    videoSrc,
    steps,
    ctaLabel:
      cleanText(section.cta?.label) ??
      cleanText(section.primaryCta?.label) ??
      "",
  };
};

const mapFeaturedCardToSlide = (
  card: StrapiBespokeFeaturedStoryCard,
  index: number,
  sectionCtaHref: string,
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
    documentId: cleanText(card.documentId) || undefined,
    src: coverUrl,
    alt: coverAlt,
    modalTitle: title,
    modalDescription: description,
    modalImages: galleryImages.length > 0 ? galleryImages : [{ src: coverUrl, alt: coverAlt }],
    href: sectionCtaHref,
  };
};

const mapFeaturedStories = (
  section?: StrapiBespokeFeaturedStoriesSection | null,
): NormalizedBespokeFeaturedStories | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  const primaryCtaLabel = cleanText(section.cta?.label) ?? "";
  const primaryCtaHref = cleanText(section.cta?.url) ?? "/featured-stories";
  const secondaryCtaLabel =
    cleanText(section.secondaryCta?.label) ?? bespokeUiDefaults.secondaryCtaLabel;
  const backgroundImage = mapResponsiveImage(section.backgroundImage);

  const slides = (section.cards ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((card, index) => mapFeaturedCardToSlide(card, index, primaryCtaHref))
    .filter((slide): slide is NormalizedBespokeFeaturedSlide => slide != null);

  // Keep section if we have a title, backdrop, slides, or any CTA — slides may be empty until CMS cards are added.
  if (!title && slides.length === 0 && !primaryCtaLabel && !backgroundImage) return null;

  return {
    title: title ?? "",
    defaultSlideIndex: slides.length > 2 ? 2 : 0,
    slides,
    backgroundImage,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    modalCtaLabel: bespokeUiDefaults.modalCtaLabel,
    modalCtaHref: bespokeUiDefaults.modalCtaHref,
  };
};

const mapMediaToPastCreationImage = (
  media: unknown,
  fallbackAlt: string,
  documentId?: string,
): NormalizedBespokePastCreationImage | null => {
  const file = extractStrapiImage(media);
  const src = resolveCmsMediaUrl(media);
  if (!src) return null;

  return {
    documentId: documentId || undefined,
    src,
    alt: resolveCmsAltText(media) ?? fallbackAlt,
    width: file?.width ?? 400,
    height: file?.height ?? 500,
  };
};

export const mapPastCreations = (
  items?: StrapiBespokePastCreation[] | null,
): NormalizedBespokePastCreations | null => {
  const images: NormalizedBespokePastCreationImage[] = [];

  for (const item of items ?? []) {
    const alt = cleanText(item.title) ?? "Past creation";
    const documentId = cleanText(item.documentId) || undefined;
    const mediaList = item.gallery?.length ? item.gallery : [item.coverImage];

    for (const media of mediaList) {
      const mapped = mapMediaToPastCreationImage(media, alt, documentId);
      if (!mapped) continue;
      images.push(mapped);
    }
  }

  if (images.length === 0) return null;

  return {
    title: bespokeUiDefaults.pastCreationsTitle,
    images,
  };
};

const GUARANTEE_ICON_OVERRIDES: Array<{
  icon: string;
  matches: (label: string, iconUrl: string) => boolean;
}> = [
  {
    icon: "/images/about/guarantees/moneyback.svg",
    matches: (label, iconUrl) =>
      label.includes("moneyback") ||
      label.includes("money back") ||
      iconUrl.includes("moneyback"),
  },
  {
    icon: "/images/about/guarantees/cod.svg",
    matches: (label, iconUrl) =>
      label.includes("cash on delivery") ||
      label.includes("cod") ||
      iconUrl.includes("/cod_") ||
      iconUrl.endsWith("/cod.svg"),
  },
  {
    icon: "/images/about/guarantees/return.svg",
    matches: (label, iconUrl) =>
      label.includes("return") ||
      label.includes("days return") ||
      iconUrl.includes("/return_") ||
      iconUrl.endsWith("/return.svg"),
  },
];

const resolveGuaranteeIconSrc = (
  label?: string | null,
  cmsUrl?: string | null,
): string | null => {
  if (!cmsUrl) return null;

  const normalizedLabel = label?.toLowerCase() ?? "";
  const normalizedUrl = cmsUrl.toLowerCase();

  const override = GUARANTEE_ICON_OVERRIDES.find((item) =>
    item.matches(normalizedLabel, normalizedUrl),
  );

  return override?.icon ?? cmsUrl;
};

const mapGuaranteeIcon = (
  highlight: StrapiBespokeServiceHighlight,
): { src: string; alt: string } | null => {
  const icon = highlight.icon;
  if (!icon || typeof icon !== "object") return null;

  let cmsUrl: string | null = null;
  let cmsAlt: string | undefined;

  // CMS field "Icon Alt Text" lives on the highlight itself (not the media file).
  const highlightAlt = cleanText(highlight.iconAltText);

  if ("desktopImage" in icon || "mobileImage" in icon) {
    const responsive = icon as StrapiBespokeResponsiveImage;
    cmsUrl =
      resolveCmsMediaUrl(responsive.desktopImage) ??
      resolveCmsMediaUrl(responsive.mobileImage) ??
      null;
    cmsAlt =
      highlightAlt ??
      cleanText(responsive.altText) ??
      cleanText(responsive.caption) ??
      resolveCmsAltText(responsive.desktopImage) ??
      resolveCmsAltText(responsive.mobileImage);
  } else {
    cmsUrl = resolveCmsMediaUrl(icon) ?? null;
    cmsAlt = highlightAlt ?? resolveCmsAltText(icon);
  }

  const src = resolveGuaranteeIconSrc(highlight.label, cmsUrl);
  if (!src) return null;

  return {
    src,
    alt: cmsAlt ?? "",
  };
};

const isCodGuaranteeLabel = (label: string): boolean => {
  const normalized = label.toLowerCase();
  return normalized.includes("cash on delivery") || normalized.includes("cod");
};

const isReturnGuaranteeLabel = (label: string): boolean => {
  return label.toLowerCase().includes("return");
};

const swapCodAndReturnGuarantees = (
  guarantees: NormalizedBespokeGuarantee[],
): NormalizedBespokeGuarantee[] => {
  const result = [...guarantees];
  const codIndex = result.findIndex((item) => isCodGuaranteeLabel(item.label));
  const returnIndex = result.findIndex((item) => isReturnGuaranteeLabel(item.label));

  if (codIndex < 0 || returnIndex < 0 || codIndex === returnIndex) {
    return result;
  }

  [result[codIndex], result[returnIndex]] = [result[returnIndex], result[codIndex]];
  return result;
};

const mapGuarantees = (
  highlights?: StrapiBespokeServiceHighlight[] | null,
): NormalizedBespokeGuarantee[] => {
  const guarantees = (highlights ?? [])
    .filter((item) => item?.isActive !== false)
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => {
      const label = cleanText(item.label);
      const icon = mapGuaranteeIcon(item);
      if (!label || !icon) return null;
      return {
        label,
        iconSrc: icon.src,
        alt: icon.alt || "",
      };
    })
    .filter((item): item is NormalizedBespokeGuarantee => item != null);

  return swapCodAndReturnGuarantees(guarantees);
};

const mapGetInTouch = (
  section?: StrapiBespokeGetInTouchSection | null,
): NormalizedBespokeGetInTouch | null => {
  if (!section || section.showField === false) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const image = mapResponsiveImage(section.backgroundImage);
  if (!image) return null;

  return {
    id: "bespoke-interested",
    title,
    description: cleanText(section.description) ?? "",
    ctaLabel: cleanText(section.cta?.label) ?? "",
    ctaHref: cleanText(section.cta?.url) ?? "",
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
    guarantees: mapGuarantees(raw.serviceHighlights),
    interested: mapGetInTouch(raw.getInTouchSection),
    customDesignForm: mapCustomDesignForm(raw.customDesignForm),
    seo: mapSeo(raw.seo),
  };
}
