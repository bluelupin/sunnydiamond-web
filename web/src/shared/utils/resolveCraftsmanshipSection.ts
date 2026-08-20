import type { CraftsmanshipSectionData } from "@/types/homepage/editorialBlocks";
import type { CraftsmanshipStep } from "@/types/homepage/craftsmanshipSteps";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";

export type ResolvedCraftsmanshipSection = {
  isActive?: boolean | null;
  sectionTitle: string;
  steps: CraftsmanshipStep[];
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  imageDesktopAlt: string;
  imageMobileAlt: string;
  imageAlt: string;
  backgroundDesktopUrl?: string;
  backgroundMobileUrl?: string;
  backgroundDesktopAlt: string;
  backgroundMobileAlt: string;
  backgroundAlt: string;
  fromCms: boolean;
};

function getCraftsmanshipMedia(section: CraftsmanshipSectionData | null | undefined) {
  return section?.image;
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
  const imageMedia = resolveResponsiveCmsImage(getCraftsmanshipMedia(section));
  const backgroundMedia = resolveResponsiveCmsImage(section?.backgroundImage);

  const sectionTitle = section?.sectionTitle?.trim() || "";

  return {
    isActive: section?.isActive,
    sectionTitle,
    steps: resolveCraftsmanshipSteps(section?.steps),
    desktopImageUrl: imageMedia.desktopUrl,
    mobileImageUrl: imageMedia.mobileUrl,
    imageDesktopAlt: imageMedia.desktopAlt,
    imageMobileAlt: imageMedia.mobileAlt,
    imageAlt: imageMedia.alt || sectionTitle,
    backgroundDesktopUrl: backgroundMedia.desktopUrl,
    backgroundMobileUrl: backgroundMedia.mobileUrl,
    backgroundDesktopAlt: backgroundMedia.desktopAlt,
    backgroundMobileAlt: backgroundMedia.mobileAlt,
    backgroundAlt: backgroundMedia.alt,
    fromCms: Boolean(section),
  };
}
