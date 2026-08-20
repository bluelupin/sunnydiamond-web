import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  EMPTY_STORE_LOCATOR_PAGE,
  type NormalizedStoreLocatorCta,
  type NormalizedStoreLocatorHero,
  type NormalizedStoreLocatorLocationFilter,
  type NormalizedStoreLocatorPage,
  type NormalizedStoreLocatorSeo,
  type NormalizedStoreLocatorShowroom,
  type StrapiStoreLocatorCta,
  type StrapiStoreLocatorHero,
  type StrapiStoreLocatorLocationFilter,
  type StrapiStoreLocatorMediaFile,
  type StrapiStoreLocatorPage,
  type StrapiStoreLocatorResponsiveImage,
  type StrapiStoreLocatorSeo,
  type StrapiStoreLocatorShowroom,
} from "./store-locator-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapCta = (cta?: StrapiStoreLocatorCta | null): NormalizedStoreLocatorCta | null => {
  const label = cleanText(cta?.label);
  const url = cleanText(cta?.url) ?? cleanText(cta?.to);
  if (!label || !url) return null;
  return { label, url };
};

const resolveResponsiveUrls = (image?: StrapiStoreLocatorResponsiveImage | null) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ?? resolveCmsMediaUrl(image?.mobileImage) ?? null;
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ?? resolveCmsMediaUrl(image?.desktopImage) ?? null;
  const alt = resolveCmsAltText(image?.desktopImage) ?? "";
  return { desktopUrl, mobileUrl, alt };
};

const resolveIconUrl = (
  icon?: StrapiStoreLocatorResponsiveImage | StrapiStoreLocatorMediaFile | null,
): string | null => {
  if (!icon || typeof icon !== "object") return null;
  if ("desktopImage" in icon || "mobileImage" in icon) {
    return (
      resolveCmsMediaUrl((icon as StrapiStoreLocatorResponsiveImage).desktopImage) ??
      resolveCmsMediaUrl((icon as StrapiStoreLocatorResponsiveImage).mobileImage) ??
      null
    );
  }
  return resolveCmsMediaUrl(icon) ?? null;
};

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapSeo = (seo?: StrapiStoreLocatorSeo | null): NormalizedStoreLocatorSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: cleanText(seo.canonicalUrl) ?? "/store-locator",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiStoreLocatorHero | null): NormalizedStoreLocatorHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const image = resolveResponsiveUrls(hero.image ?? hero.backgroundImage);
  const videoUrl =
    resolveCmsMediaUrl(hero.video?.heroVideo) ??
    resolveCmsMediaUrl(hero.backgroundVideo?.heroVideo) ??
    null;
  const title = cleanText(hero.title) ?? null;
  if (!title && !image.desktopUrl && !videoUrl) return null;

  return {
    title,
    subtitle: cleanText(hero.subtitle) ?? cleanText(hero.description) ?? null,
    desktopImageUrl: image.desktopUrl,
    mobileImageUrl: image.mobileUrl,
    imageAlt: image.alt,
    videoUrl,
    primaryCta: mapCta(hero.primaryCta ?? hero.cta),
    secondaryCta: mapCta(hero.secondaryCta),
  };
};

const mapLocationFilter = (
  filter?: StrapiStoreLocatorLocationFilter | null,
): NormalizedStoreLocatorLocationFilter | null => {
  if (!filter || !resolveSectionActive(filter.isActive, filter.showField)) return null;

  const label = cleanText(filter.label);
  if (!label) return null;

  const value = cleanText(filter.value) ?? label;
  const id =
    filter.id != null
      ? String(filter.id)
      : cleanText(filter.slug) ?? slugify(value);

  return {
    id,
    label,
    value,
    iconUrl: resolveIconUrl(filter.icon),
    iconAlt: resolveCmsAltText(
      (filter.icon as StrapiStoreLocatorResponsiveImage | null | undefined)?.desktopImage,
    ) ?? undefined,
  };
};

const mapShowroom = (
  showroom?: StrapiStoreLocatorShowroom | null,
): NormalizedStoreLocatorShowroom | null => {
  if (!showroom || !resolveSectionActive(showroom.isActive, showroom.showField)) {
    return null;
  }

  const name = cleanText(showroom.name);
  if (!name) return null;

  const image =
    resolveCmsMediaUrl(showroom.image?.desktopImage) ??
    resolveCmsMediaUrl(showroom.image?.mobileImage) ??
    "";

  const mapUrl =
    cleanText(showroom.mapUrl) ||
    cleanText(showroom.directionsUrl) ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

  return {
    id:
      showroom.id != null
        ? String(showroom.id)
        : cleanText(showroom.documentId) ?? slugify(name),
    documentId: cleanText(showroom.documentId),
    name,
    slug: cleanText(showroom.slug) ?? null,
    address: cleanText(showroom.address) || name,
    city: cleanText(showroom.city) ?? null,
    state: cleanText(showroom.state) ?? null,
    phone: cleanText(showroom.phone) || "",
    email: cleanText(showroom.email) ?? null,
    mapUrl,
    mapEmbed: cleanText(showroom.mapEmbed) ?? null,
    openingHours: cleanText(showroom.openingHours) ?? null,
    imageUrl: image,
    sortOrder: typeof showroom.sortOrder === "number" ? showroom.sortOrder : 0,
  };
};

export function mapStoreLocatorPage(
  raw?: StrapiStoreLocatorPage | null,
): NormalizedStoreLocatorPage {
  if (!raw) return EMPTY_STORE_LOCATOR_PAGE;

  const locationFilters = (raw.locationFilters ?? [])
    .map(mapLocationFilter)
    .filter((item): item is NormalizedStoreLocatorLocationFilter => item != null);

  const showrooms = (raw.showrooms ?? [])
    .map(mapShowroom)
    .filter((item): item is NormalizedStoreLocatorShowroom => item != null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    hero: mapHero(raw.hero),
    searchPlaceholder: cleanText(raw.searchPlaceholder) ?? null,
    useCurrentLocationLabel: cleanText(raw.useCurrentLocationLabel) ?? null,
    locationFilters,
    getDirectionsLabel: cleanText(raw.getDirectionsLabel) ?? null,
    noResultsMessage: cleanText(raw.noResultsMessage) ?? null,
    showrooms,
    seo: mapSeo(raw.seo),
  };
}
