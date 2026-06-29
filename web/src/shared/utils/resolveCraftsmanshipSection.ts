import { homeContent } from "@/features/cms/data/content";
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

const FALLBACK = homeContent.craftsmanship;

function getCraftsmanshipMedia(section: CraftsmanshipSectionData | null | undefined) {
  return section?.image ?? section?.diamondImage;
}

function resolveCraftsmanshipSteps(
  cmsSteps: CraftsmanshipStep[] | null | undefined,
): CraftsmanshipStep[] {
  const normalized = Array.isArray(cmsSteps)
    ? [...cmsSteps]
        .filter((step) => step?.isActive !== false)
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    : [];

  if (normalized.length > 0) {
    return normalized;
  }

  return FALLBACK.steps.map((step, index) => ({
    id: index,
    sortOrder: index,
    number: step.number,
    title: step.title,
    description: step.description,
    isActive: true,
  }));
}

export function resolveCraftsmanshipSection(
  section: CraftsmanshipSectionData | null | undefined,
): ResolvedCraftsmanshipSection {
  const media = getCraftsmanshipMedia(section);
  const desktopSource = media?.desktopImage ?? media?.data?.attributes ?? media;
  const mobileSource = media?.mobileImage ?? media?.data?.attributes ?? media;

  const desktopImageUrl = resolveCmsMediaUrl(desktopSource);
  const mobileImageUrl = resolveCmsMediaUrl(mobileSource);

  const sectionTitle =
    section?.sectionTitle?.trim() ||
    section?.title?.trim() ||
    FALLBACK.title;

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
