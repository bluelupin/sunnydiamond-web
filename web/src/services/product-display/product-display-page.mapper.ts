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
  type StrapiProductDisplayCartStripItem,
  type StrapiProductDisplayCartStripSection,
  type StrapiProductDisplayPage,
  type StrapiProductDisplayStripItem,
  type StrapiProductDisplayVisitUsSection,
} from "./product-display-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

function resolveVisitUsResponsiveImage(
  image?: StrapiProductDisplayVisitUsSection["backgroundImage"] | null,
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

/** Only the fields exposed in the PDP Visit Us CMS editor: title, welcome note, appointment label, background image, show section. */
export function mapVisitUsSection(
  raw?: StrapiProductDisplayVisitUsSection | null,
): NormalizedVisitUsSection {
  const empty = EMPTY_PRODUCT_DISPLAY_PAGE.visitUs;

  if (!raw || raw.showField === false) {
    return { ...empty, isActive: false };
  }

  const backgroundImage = resolveVisitUsResponsiveImage(raw.backgroundImage);

  const desktopSrc = backgroundImage?.desktopSrc ?? "";
  const mobileSrc = backgroundImage?.mobileSrc ?? "";
  const imageSrc = desktopSrc || mobileSrc;
  const imageAlt = backgroundImage?.imageAlt ?? "";

  return {
    isActive: true,
    title: cleanText(raw.sectionTitle) ?? "",
    description: cleanText(raw.welcomeNote) ?? "",
    imageSrc,
    mobileImageSrc: mobileSrc && mobileSrc !== imageSrc ? mobileSrc : undefined,
    imageAlt,
    ctaLabel: cleanText(raw.appointmentLabel) ?? "",
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

function unwrapStrapiComponentEntry<T extends Record<string, unknown>>(entry: unknown): T {
  if (!entry || typeof entry !== "object") {
    return entry as T;
  }

  if ("attributes" in entry) {
    const record = entry as { id?: number; attributes?: Record<string, unknown> };
    if (record.attributes && typeof record.attributes === "object") {
      return { ...record.attributes, id: record.id } as unknown as T;
    }
  }

  return entry as T;
}

function coerceStrapiComponentArray<T extends Record<string, unknown>>(value: unknown): T[] {
  const list = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)
      ? (value as { data: unknown[] }).data
      : [];

  return list
    .map((entry) => unwrapStrapiComponentEntry<T>(entry))
    .filter((entry): entry is T => Boolean(entry));
}

function resolveStripItemActive(raw: StrapiProductDisplayStripItem): boolean {
  if (raw.isActive === false || raw.showField === false) {
    return false;
  }

  return true;
}

function resolveStripItemIcon(icon?: StrapiProductDisplayStripItem["icon"]): string | undefined {
  if (!icon) {
    return undefined;
  }

  return (
    resolveCmsMediaUrl(icon) ??
    resolveCmsMediaUrl(
      "desktopImage" in icon || "mobileImage" in icon ? icon.desktopImage : undefined,
    ) ??
    resolveCmsMediaUrl("mobileImage" in icon ? icon.mobileImage : undefined)
  );
}

function mapStripItem(
  raw: StrapiProductDisplayStripItem,
): NormalizedProductDisplayBenefit | null {
  if (!resolveStripItemActive(raw)) {
    return null;
  }

  const title =
    cleanText(raw.title) ?? cleanText(raw.label) ?? cleanText(raw.description);
  const icon = resolveStripItemIcon(raw.icon);

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

function mapStripItems(rawItems: unknown): NormalizedProductDisplayBenefit[] {
  return coerceStrapiComponentArray<StrapiProductDisplayStripItem>(rawItems)
    .map(mapStripItem)
    .filter((item): item is NormalizedProductDisplayBenefit => item !== null);
}

function mapStripMeta(raw?: StrapiProductDisplayPage | null): Pick<
  NormalizedProductDisplayStrip,
  "title" | "tnc"
> {
  return {
    title: cleanText(raw?.stripTitle) ?? "",
    tnc: {
      label: cleanText(raw?.stripTnc?.label) ?? "",
      href: cleanText(raw?.stripTnc?.url) ?? "",
      openInNewTab: raw?.stripTnc?.openInNewTab === true,
    },
  };
}

function mapPdpStripSection(raw?: StrapiProductDisplayPage | null): NormalizedProductDisplayStrip {
  return {
    ...mapStripMeta(raw),
    items: mapStripItems(raw?.stripItems),
  };
}

function resolveCartStripSection(
  raw?: StrapiProductDisplayPage | null,
): StrapiProductDisplayCartStripSection | null {
  const section = unwrapStrapiComponentEntry<StrapiProductDisplayCartStripSection>(
    raw?.stripCartItems,
  );

  return section ?? null;
}

function mapCartStripItem(
  raw: StrapiProductDisplayCartStripItem,
): NormalizedProductDisplayBenefit | null {
  if (raw.showBadge === false) {
    return null;
  }

  const title = cleanText(raw.badgeTitle);
  const icon = resolveStripItemIcon(raw.icon);

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

function mapCartStripItems(rawItems: unknown): NormalizedProductDisplayBenefit[] {
  return coerceStrapiComponentArray<StrapiProductDisplayCartStripItem>(rawItems)
    .map(mapCartStripItem)
    .filter((item): item is NormalizedProductDisplayBenefit => item !== null);
}

export function mapCartStripSection(
  raw?: StrapiProductDisplayPage | null,
): NormalizedProductDisplayStrip {
  const section = resolveCartStripSection(raw);

  if (!section) {
    return EMPTY_PRODUCT_DISPLAY_PAGE.cartStrip;
  }

  const tncCta = section.tncCta;

  return {
    title: cleanText(section.title) ?? "",
    tnc: {
      label: cleanText(tncCta?.label) ?? "",
      href: cleanText(tncCta?.url) ?? "",
      openInNewTab: tncCta?.openInNewTab === true,
    },
    items: mapCartStripItems(section.items),
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
    strip: mapPdpStripSection(raw),
    cartStrip: mapCartStripSection(raw),
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
