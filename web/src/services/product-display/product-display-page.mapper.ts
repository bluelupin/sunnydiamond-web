import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  EMPTY_PRODUCT_DISPLAY_PAGE,
  type NormalizedProductDisplayBenefit,
  type NormalizedProductDisplayCard,
  type NormalizedProductDisplayCardButton,
  type NormalizedProductDisplayPage,
  type NormalizedProductDisplayStrip,
  type NormalizedVisitUsSection,
  type StrapiProductDisplayCard,
  type StrapiProductDisplayCardButton,
  type StrapiProductDisplayPage,
  type StrapiProductDisplayStripItem,
  type StrapiProductDisplayVisitShowroom,
  type StrapiProductDisplayVisitUsSection,
} from "./product-display-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

type VisitUsCtaSource = {
  cta?: StrapiProductDisplayVisitUsSection["cta"];
  formCta?: StrapiProductDisplayVisitUsSection["formCta"];
};

export function resolveVisitUsCtaFields(raw?: VisitUsCtaSource | null): {
  ctaLabel: string;
  ctaUrl?: string;
  bookVisitFormTag?: string;
} {
  const ctaLabel =
    cleanText(raw?.cta?.label) ?? cleanText(raw?.formCta?.label) ?? "";
  const ctaUrl = cleanText(raw?.cta?.url);
  const bookVisitFormTag = cleanText(raw?.formCta?.modalTag);

  return {
    ctaLabel,
    ...(ctaUrl ? { ctaUrl } : {}),
    ...(bookVisitFormTag ? { bookVisitFormTag } : {}),
  };
}

function resolveVisitUsResponsiveImage(
  image?: StrapiProductDisplayVisitUsSection["image"] | null,
): { desktopSrc: string; mobileSrc: string; imageAlt: string } | null {
  const desktopSrc = resolveCmsMediaUrl(image?.desktopImage);
  const mobileSrc = resolveCmsMediaUrl(image?.mobileImage);
  const resolvedDesktop = desktopSrc ?? mobileSrc;
  const resolvedMobile = mobileSrc ?? desktopSrc;

  if (!resolvedDesktop && !resolvedMobile) {
    return null;
  }

  return {
    desktopSrc: resolvedDesktop ?? "",
    mobileSrc: resolvedMobile ?? "",
    imageAlt: resolveCmsAltText(image?.desktopImage) ?? "",
  };
}

function resolveFirstShowroomVisitImage(
  showrooms?: StrapiProductDisplayVisitShowroom[] | null,
): { desktopSrc: string; mobileSrc: string; imageAlt: string } | null {
  const firstShowroom = Array.isArray(showrooms) ? showrooms[0] : undefined;
  if (!firstShowroom || !isSectionActive(firstShowroom.isActive)) {
    return null;
  }

  return resolveVisitUsResponsiveImage(firstShowroom.image);
}

export function mapVisitUsSection(
  raw?: StrapiProductDisplayVisitUsSection | null,
): NormalizedVisitUsSection {
  const empty = EMPTY_PRODUCT_DISPLAY_PAGE.visitUs;

  if (!raw || raw.showField === false) {
    return { ...empty, isActive: false };
  }

  const showroomImage = resolveFirstShowroomVisitImage(raw.showrooms);
  const { ctaLabel, ctaUrl, bookVisitFormTag } = resolveVisitUsCtaFields(raw);

  const desktopSrc = showroomImage?.desktopSrc ?? "";
  const mobileSrc = showroomImage?.mobileSrc ?? "";
  const imageSrc = desktopSrc || mobileSrc;
  const imageAlt = showroomImage?.imageAlt ?? "";

  return {
    isActive: true,
    title: cleanText(raw.sectionTitle) ?? "",
    description: cleanText(raw.description) ?? "",
    imageSrc,
    mobileImageSrc: mobileSrc && mobileSrc !== imageSrc ? mobileSrc : undefined,
    imageAlt,
    ctaLabel,
    ...(ctaUrl ? { ctaUrl } : {}),
    ...(bookVisitFormTag ? { bookVisitFormTag } : {}),
  };
}

function splitBenefitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return [title.trim(), ""];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")] as [string, string];
}

function mapStripItem(
  raw: StrapiProductDisplayStripItem,
): NormalizedProductDisplayBenefit | null {
  if (!isSectionActive(raw.isActive)) {
    return null;
  }

  const title = cleanText(raw.title);
  const icon = resolveCmsMediaUrl(raw.icon);

  if (!title || !icon) {
    return null;
  }

  const lines = splitBenefitTitle(title);

  return {
    label: title,
    mobileLabel: title,
    lines,
    icon,
  };
}

function mapStripSection(raw?: StrapiProductDisplayPage | null): NormalizedProductDisplayStrip {
  const items = (Array.isArray(raw?.stripItems) ? raw.stripItems : [])
    .map(mapStripItem)
    .filter((item): item is NormalizedProductDisplayBenefit => item !== null);

  return {
    title: cleanText(raw?.stripTitle) ?? "",
    tnc: {
      label: cleanText(raw?.stripTnc?.label) ?? "",
      href: cleanText(raw?.stripTnc?.url) ?? "",
      openInNewTab: raw?.stripTnc?.openInNewTab === true,
    },
    items,
  };
}

function resolveCardImageSrc(
  image?: StrapiProductDisplayCard["image"],
): string | undefined {
  if (!image) {
    return undefined;
  }

  return (
    resolveCmsMediaUrl(image) ??
    resolveCmsMediaUrl(
      "desktopImage" in image || "mobileImage" in image ? image.desktopImage : undefined,
    ) ??
    resolveCmsMediaUrl("mobileImage" in image ? image.mobileImage : undefined)
  );
}

function mapCardButton(
  raw: StrapiProductDisplayCardButton,
): NormalizedProductDisplayCardButton | null {
  const label = cleanText(raw.label);
  const modalTag = cleanText(raw.modalTag);
  const url = cleanText(raw.url);

  if (!label || (!modalTag && !url)) {
    return null;
  }

  const style = raw.style?.trim().toLowerCase() === "primary" ? "primary" : "secondary";

  return {
    label,
    style,
    ...(modalTag ? { modalTag } : {}),
    ...(url ? { url } : {}),
    openInNewTab: raw.openInNewTab === true,
  };
}

function mapCardButtons(
  raw?: StrapiProductDisplayCardButton[] | null,
): NormalizedProductDisplayCardButton[] {
  return (Array.isArray(raw) ? raw : [])
    .map(mapCardButton)
    .filter((button): button is NormalizedProductDisplayCardButton => button !== null);
}

function mapCardSection(
  raw?: StrapiProductDisplayCard | null,
): NormalizedProductDisplayCard {
  if (!raw) {
    return { title: "", subtitle: "", isActive: false, buttons: [] };
  }

  const imageSrc = resolveCardImageSrc(raw.image);

  return {
    title: cleanText(raw.title) ?? "",
    subtitle: cleanText(raw.subtitle) ?? "",
    isActive: isSectionActive(raw.isActive),
    buttons: mapCardButtons(raw.buttons),
    ...(imageSrc ? { imageSrc } : {}),
  };
}

export function mapProductDisplayPage(
  raw?: StrapiProductDisplayPage | null,
): NormalizedProductDisplayPage {
  if (!raw) {
    return EMPTY_PRODUCT_DISPLAY_PAGE;
  }

  return {
    strip: mapStripSection(raw),
    findYourSizeLabel: cleanText(raw.findYourSize?.label) ?? "",
    hereForYou: mapCardSection(raw.hereForYouCard),
    personalise: mapCardSection(raw.personaliseCard),
    pairItWith: {
      isActive: raw.pairItWith ? isSectionActive(raw.pairItWith.isActive) : false,
      sectionHeading: "",
    },
    moreForYouTitle: cleanText(raw.moreForYouTitle) ?? "",
    visitUs: mapVisitUsSection(raw.visitUsSection),
  };
}
