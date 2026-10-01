import type { CraftsmanshipSectionData } from "@/types/homepage/editorialBlocks";
import type { CraftsmanshipStep } from "@/types/homepage/craftsmanshipSteps";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

export type ResolvedCraftsmanshipSection = {
  isActive?: boolean | null;
  showField?: boolean;
  sectionTitle: string;
  steps: CraftsmanshipStep[];
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  desktopIsVideo: boolean;
  mobileIsVideo: boolean;
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

function isVideoMedia(media: unknown, url?: string): boolean {
  if (media && typeof media === "object") {
    const record = media as { mime?: string; data?: unknown; attributes?: unknown };
    if (record.mime?.toLowerCase().startsWith("video/")) return true;
    if (record.data) return isVideoMedia(record.data, url);
    if (record.attributes) return isVideoMedia(record.attributes, url);
  }
  return /\.(?:mp4|webm|ogg|ogv|mov|m4v)(?:[?#]|$)/i.test(url ?? "");
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
  const directUrl = section?.url ? resolveCmsMediaUrl({ url: section.url }) : undefined;
  const desktopUrl = directUrl ?? imageMedia.desktopUrl ?? imageMedia.mobileUrl;
  const mobileUrl = directUrl ?? imageMedia.mobileUrl ?? desktopUrl;
  const media = getCraftsmanshipMedia(section);
  const desktopMedia = directUrl ? section : media?.desktopImage ?? media?.mobileImage ?? media;
  const mobileMedia = directUrl ? section : media?.mobileImage ?? desktopMedia;
  const backgroundMedia = resolveResponsiveCmsImage(section?.backgroundImage);

  const sectionTitle = section?.sectionTitle?.trim() || "";

  return {
    isActive: section?.isActive,
    showField: section?.showField,
    sectionTitle,
    steps: resolveCraftsmanshipSteps(section?.steps),
    desktopImageUrl: desktopUrl,
    mobileImageUrl: mobileUrl,
    desktopIsVideo: isVideoMedia(desktopMedia, desktopUrl),
    mobileIsVideo: isVideoMedia(mobileMedia, mobileUrl),
    imageDesktopAlt: imageMedia.desktopAlt,
    imageMobileAlt: imageMedia.mobileAlt,
    imageAlt: imageMedia.alt,
    backgroundDesktopUrl: backgroundMedia.desktopUrl,
    backgroundMobileUrl: backgroundMedia.mobileUrl,
    backgroundDesktopAlt: backgroundMedia.desktopAlt,
    backgroundMobileAlt: backgroundMedia.mobileAlt,
    backgroundAlt: backgroundMedia.alt,
    fromCms: Boolean(section),
  };
}
