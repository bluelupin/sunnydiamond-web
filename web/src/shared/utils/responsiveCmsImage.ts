import type { CategoryNavigationImage } from "@/types/homepage/categoryNavigation";
import type { StrapiMedia } from "@/types/homepage/hero";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

type ResponsiveMedia = CategoryNavigationImage | StrapiMedia | null | undefined;

export function resolveResponsiveCmsImage(media: ResponsiveMedia) {
  const record = media as CategoryNavigationImage | StrapiMedia | null | undefined;

  const desktopImage =
    (record as CategoryNavigationImage)?.desktopImage ?? record ?? null;
  const mobileImage =
    (record as CategoryNavigationImage)?.mobileImage ?? desktopImage ?? null;

  return {
    desktopUrl: resolveCmsMediaUrl(desktopImage),
    mobileUrl: resolveCmsMediaUrl(mobileImage),
    alt:
      resolveCmsAltText(desktopImage) ||
      resolveCmsAltText(mobileImage) ||
      "",
  };
}
