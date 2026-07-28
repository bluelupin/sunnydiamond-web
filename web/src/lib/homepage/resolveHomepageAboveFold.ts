import { preload } from "react-dom";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type { NormalizedHomepageShell } from "@/services/homepage/homepageShell.service";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";

export type ResolvedHeroContent = {
  eyebrow: string;
  titleLines: string[];
  primaryCtaUrl: string;
  primaryCtaLabel: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  heroAlt: string;
  heroVideoUrl?: string;
};

export type ResolvedCraftingRarityContent = {
  subtitleLines: string[];
  secondaryCtaUrl: string;
  secondaryCtaLabel: string;
  categories: CategoryNavigationItem[];
  cutoutDesktopUrl?: string;
  cutoutMobileUrl?: string;
  cutoutAlt?: string;
};

export function splitHeroTitleLines(title: string): string[] {
  const heroTitle = title.trim();
  if (!heroTitle) return [];

  if (heroTitle.includes("\n")) {
    return heroTitle.split("\n");
  }

  const breakAfter = "Fine jewellery designed";
  if (heroTitle.startsWith(breakAfter)) {
    return [breakAfter, heroTitle.slice(breakAfter.length).trim()].filter(Boolean);
  }

  return [heroTitle];
}

export function splitCraftingTitleLines(title: string): string[] {
  const trimmed = title.trim();
  if (!trimmed) return [];

  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const breakAfter = "Crafting Rarity";
  if (trimmed.toLowerCase().startsWith(breakAfter.toLowerCase())) {
    const remainder = trimmed.slice(breakAfter.length).trim();
    return remainder ? [breakAfter, remainder] : [trimmed];
  }

  return [trimmed];
}

export function resolveHeroContent(
  shell?: NormalizedHomepageShell | null,
): ResolvedHeroContent | null {
  const hero = shell?.homepage?.hero || shell?.hero;
  if (!hero) return null;

  const heroImage = hero.image;
  const desktopImageUrl = resolveCmsMediaUrl(heroImage?.desktopImage ?? heroImage) ?? "";
  const mobileImageUrl =
    resolveCmsMediaUrl(heroImage?.mobileImage ?? heroImage?.desktopImage ?? heroImage) ??
    undefined;

  const heroAlt =
    heroImage?.altText ||
    resolveCmsAltText(heroImage?.desktopImage ?? heroImage) ||
    resolveCmsAltText(heroImage?.mobileImage ?? heroImage?.desktopImage) ||
    hero.title ||
    "";

  return {
    eyebrow: hero.eyebrow ?? "",
    titleLines: splitHeroTitleLines(hero.title ?? ""),
    primaryCtaUrl: hero.primaryCta?.url ?? "",
    primaryCtaLabel: hero.primaryCta?.label ?? "",
    desktopImageUrl,
    mobileImageUrl,
    heroAlt,
    heroVideoUrl: getCmsAssetUrl(hero.videoUrl),
  };
}

function resolveCraftingCategories(
  shopping?: HomepageShoppingBlocksData | null,
): CategoryNavigationItem[] {
  const items = shopping?.categoryNavigation;
  if (!Array.isArray(items)) return [];

  return [...items]
    .filter((item) => item?.isActive !== false)
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
}

export function resolveCraftingRarityContent(
  shell?: NormalizedHomepageShell | null,
  editorial?: HomepageEditorialBlocksData | null,
  shopping?: HomepageShoppingBlocksData | null,
): ResolvedCraftingRarityContent {
  const hero = shell?.homepage?.hero || shell?.hero;
  const craftingBrilliance = editorial?.craftingBrillianceSection ?? null;

  const titleSource =
    craftingBrilliance?.title?.trim() || hero?.subtitle?.trim() || "";

  const cutoutImages = resolveResponsiveCmsImage(craftingBrilliance?.cutoutImage);
  const cutoutAlt =
    cutoutImages.alt ||
    craftingBrilliance?.cutoutImage?.altText?.trim() ||
    titleSource ||
    "";

  return {
    subtitleLines: splitCraftingTitleLines(titleSource),
    secondaryCtaUrl:
      craftingBrilliance?.cta?.url ??
      craftingBrilliance?.cta?.to ??
      hero?.secondaryCta?.url ??
      hero?.secondaryCta?.to ??
      "/jewellery",
    secondaryCtaLabel:
      craftingBrilliance?.cta?.label?.trim() ??
      hero?.secondaryCta?.label ??
      "Explore Products",
    categories: resolveCraftingCategories(shopping),
    ...(cutoutImages.desktopUrl || cutoutImages.mobileUrl
      ? {
          cutoutDesktopUrl: cutoutImages.desktopUrl || cutoutImages.mobileUrl,
          cutoutMobileUrl: cutoutImages.mobileUrl || cutoutImages.desktopUrl,
          cutoutAlt,
        }
      : {}),
  };
}

export function preloadHeroLcpImages(hero: ResolvedHeroContent | null): void {
  if (!hero) return;

  const mobileLcp = hero.mobileImageUrl || hero.desktopImageUrl;
  if (mobileLcp) {
    preload(mobileLcp, { as: "image", fetchPriority: "high" });
  }

  if (hero.desktopImageUrl && hero.desktopImageUrl !== mobileLcp) {
    preload(hero.desktopImageUrl, { as: "image", fetchPriority: "high" });
  }
}
