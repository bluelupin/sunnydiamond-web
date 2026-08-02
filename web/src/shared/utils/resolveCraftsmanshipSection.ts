import type { CraftsmanshipSectionData } from "@/types/homepage/editorialBlocks";
import type { CraftsmanshipStep } from "@/types/homepage/craftsmanshipSteps";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

export type ResolvedCraftsmanshipSection = {
  isActive?: boolean | null;
  sectionTitle: string;
  steps: CraftsmanshipStep[];
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  imageAlt: string;
  fromCms: boolean;
};

function getCraftsmanshipMedia(section: CraftsmanshipSectionData | null | undefined) {
  return section?.image ?? section?.diamondImage;
}

function resolveCraftsmanshipSteps(
  cmsSteps: CraftsmanshipStep[] | null | undefined,
): CraftsmanshipStep[] {
  if (!Array.isArray(cmsSteps)) return [];

  return cmsSteps.filter((step) => step?.isActive !== false);
}

export function resolveCraftsmanshipSection(
  section: CraftsmanshipSectionData | null | undefined,
): ResolvedCraftsmanshipSection {
  const media = getCraftsmanshipMedia(section);
  const responsiveMedia = media as
    | (CraftsmanshipSectionData["image"] & {
        data?: { attributes?: unknown };
      })
    | null
    | undefined;
  const desktopSource =
    responsiveMedia?.desktopImage ??
    responsiveMedia?.data?.attributes ??
    responsiveMedia;
  const mobileSource =
    responsiveMedia?.mobileImage ??
    responsiveMedia?.data?.attributes ??
    responsiveMedia;

  const desktopImageUrl = resolveCmsMediaUrl(desktopSource);
  const mobileImageUrl = resolveCmsMediaUrl(mobileSource);

  const sectionTitle =
    section?.sectionTitle?.trim() ||
    section?.title?.trim() ||
    "";

  const imageAlt =
    section?.image?.altText ||
    resolveCmsAltText(desktopSource) ||
    resolveCmsAltText(mobileSource) ||
    sectionTitle;

  return {
    isActive: section?.isActive,
    sectionTitle,
    steps: resolveCraftsmanshipSteps(section?.steps),
    desktopImageUrl,
    mobileImageUrl,
    imageAlt,
    fromCms: Boolean(section),
  };
}
