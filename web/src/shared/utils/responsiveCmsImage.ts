import type {
  CategoryNavigationImage,
  CategoryNavigationItem,
} from "@/types/homepage/categoryNavigation";
import type { StrapiMedia } from "@/types/homepage/hero";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

type ResponsiveMedia = CategoryNavigationImage | StrapiMedia | null | undefined;

export function resolveCategoryNavImages(cat: CategoryNavigationItem) {
  const productMedia = (cat?.image ?? cat?.cutoutImage) as ResponsiveMedia;
  const hoverMedia = cat?.hoverImage as ResponsiveMedia;

  const product = resolveResponsiveCmsImage(productMedia);
  const hover = resolveResponsiveCmsImage(hoverMedia);

  const title = cat?.title ?? cat?.label ?? cat?.cta?.label ?? "";

  return {
    title,
    desktopImageUrl: product.desktopUrl || hover.desktopUrl,
    mobileImageUrl: product.mobileUrl || product.desktopUrl || hover.mobileUrl || hover.desktopUrl,
    hoverDesktopImageUrl: hover.desktopUrl,
    hoverMobileImageUrl: hover.mobileUrl || hover.desktopUrl,
    imageAlt: product.alt || hover.alt || title,
    hoverAlt: hover.alt || product.alt || title,
    hasDistinctHover:
      Boolean(hover.desktopUrl || hover.mobileUrl) &&
      (hover.desktopUrl !== product.desktopUrl || hover.mobileUrl !== product.mobileUrl),
  };
}

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
