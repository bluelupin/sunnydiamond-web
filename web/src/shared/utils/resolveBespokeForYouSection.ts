import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import type {
  BespokeForYouSectionCta,
  BespokeForYouSectionData,
} from "@/types/homepage/bespokeForYouSection";

export type ResolvedBespokeForYouSection = {
  isActive?: boolean;
  showField?: boolean;
  sectionTitle?: string;
  subtitle?: string;
  image?: BespokeForYouSectionData["image"];
  primaryCta?: BespokeForYouSectionCta;
  secondaryCta?: BespokeForYouSectionCta;
  fromCms: boolean;
};

export function resolveBespokeForYouSection(
  editorialData?: HomepageEditorialBlocksData | null,
): ResolvedBespokeForYouSection {
  const section = editorialData?.bespokeForYouSection ?? null;

  return {
    isActive: section?.isActive,
    showField: section?.showField,
    sectionTitle: section?.sectionTitle,
    subtitle: section?.subtitle ?? section?.description,
    image: section?.image,
    primaryCta: section?.primaryCta,
    secondaryCta: section?.secondaryCta,
    fromCms: Boolean(section),
  };
}
