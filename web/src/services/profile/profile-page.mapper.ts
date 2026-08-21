import type { ProfileNavItem } from "@/features/account/data/profileSections";
import type { ProfileSectionId } from "@/features/account/types";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  EMPTY_PROFILE_PAGE,
  type NormalizedProfileBackgroundImage,
  type NormalizedProfileCta,
  type NormalizedProfilePage,
  type NormalizedProfileSideTab,
  type NormalizedProfileTrustBadge,
  type StrapiProfileCta,
  type StrapiProfilePage,
  type StrapiProfileResponsiveImage,
  type StrapiProfileSideTab,
  type StrapiProfileTrustBadge,
} from "./profile-page.types";

const CMS_TAB_VALUE_TO_SECTION_ID: Record<string, ProfileSectionId> = {
  profile: "details",
  orders: "orders",
  addresses: "addresses",
  wishlist: "wishlist",
  appointments: "appointments",
  diamonds: "diamonds_for_everyone",
  bespoke: "bespoke",
  support: "support",
};

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

function mapTabValueToSectionId(tabValue: string): ProfileSectionId | null {
  return CMS_TAB_VALUE_TO_SECTION_ID[tabValue.trim().toLowerCase()] ?? null;
}

function mapBackgroundImage(
  image?: StrapiProfileResponsiveImage | null,
): NormalizedProfileBackgroundImage | null {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ?? resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ?? resolveCmsMediaUrl(image?.desktopImage);

  if (!desktopUrl && !mobileUrl) return null;

  return {
    desktopUrl: desktopUrl ?? "",
    mobileUrl: mobileUrl ?? "",
    alt:
      resolveCmsAltText(image?.desktopImage) ??
      resolveCmsAltText(image?.mobileImage) ??
      "Sunny Diamonds profile banner",
  };
}

function normalizeCtaHref(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "#";

  if (
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  if (trimmed.includes("@")) {
    return `mailto:${trimmed}`;
  }

  return trimmed;
}

function mapCta(raw?: StrapiProfileCta | null): NormalizedProfileCta | null {
  const label = cleanText(raw?.label);
  const url = cleanText(raw?.url);
  if (!label || !url) return null;

  return {
    id: raw?.id != null ? String(raw.id) : label,
    label,
    href: normalizeCtaHref(url),
    openInNewTab: raw?.openInNewTab === true,
  };
}

function mapSideTab(raw: StrapiProfileSideTab): NormalizedProfileSideTab | null {
  const tabLabel = cleanText(raw.tabLabel);
  const tabValue = cleanText(raw.tabValue);
  if (!tabLabel || !tabValue) return null;

  const sectionId = mapTabValueToSectionId(tabValue);
  if (!sectionId) return null;

  return {
    id: raw.id != null ? String(raw.id) : `${tabValue}-${tabLabel}`,
    tabLabel,
    tabValue,
    sectionId,
  };
}

function mapTrustBadge(raw: StrapiProfileTrustBadge): NormalizedProfileTrustBadge | null {
  const title = cleanText(raw.title);
  const description = cleanText(raw.description);
  if (!title || !description) return null;

  const callsToAction = (raw.callsToAction ?? [])
    .map(mapCta)
    .filter((cta): cta is NormalizedProfileCta => cta != null);

  return {
    id: raw.id != null ? String(raw.id) : title,
    title,
    description,
    callsToAction,
  };
}

export function mapProfileNavItems(tabs: NormalizedProfileSideTab[]): ProfileNavItem[] {
  return tabs.map((tab) => ({
    kind: "section" as const,
    id: tab.sectionId,
    label: tab.tabLabel,
  }));
}

export function mapProfilePage(raw?: StrapiProfilePage | null): NormalizedProfilePage {
  if (!raw) return EMPTY_PROFILE_PAGE;

  const sideTabs = (raw.sideTabs ?? [])
    .map(mapSideTab)
    .filter((tab): tab is NormalizedProfileSideTab => tab != null);

  const trustBadges = (raw.trustBadgeSection ?? [])
    .map(mapTrustBadge)
    .filter((badge): badge is NormalizedProfileTrustBadge => badge != null);

  return {
    sideTabs,
    backgroundImage: mapBackgroundImage(raw.backgroundImage),
    trustBadges,
  };
}
