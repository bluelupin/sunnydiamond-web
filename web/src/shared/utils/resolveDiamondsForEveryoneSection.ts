import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import type {
  DiamondsForEveryoneSectionCta,
  SavingsPlanStep,
} from "@/types/homepage/diamondsForEveryoneSection";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";

export type ResolvedDiamondsForEveryoneSection = {
  isActive?: boolean;
  eyebrow?: string;
  sectionTitle?: string;
  subtitle?: string;
  steps?: SavingsPlanStep[];
  cta?: DiamondsForEveryoneSectionCta;
  backgroundDesktopUrl?: string;
  backgroundMobileUrl?: string;
  backgroundDesktopAlt: string;
  backgroundMobileAlt: string;
  backgroundAlt: string;
  fromCms: boolean;
};

export function resolveDiamondsForEveryoneSection(
  editorialData?: HomepageEditorialBlocksData | null,
): ResolvedDiamondsForEveryoneSection {
  const section = editorialData?.diamondsForEveryoneSection ?? null;
  const background = resolveResponsiveCmsImage(
    (section?.backgroundImage ?? null) as Parameters<typeof resolveResponsiveCmsImage>[0],
  );

  return {
    isActive: section?.isActive,
    eyebrow: section?.eyebrow,
    sectionTitle: section?.sectionTitle,
    subtitle: section?.subtitle ?? section?.description,
    steps: section?.steps,
    cta: section?.cta,
    backgroundDesktopUrl: background.desktopUrl || undefined,
    backgroundMobileUrl: background.mobileUrl || undefined,
    backgroundDesktopAlt: background.desktopAlt,
    backgroundMobileAlt: background.mobileAlt,
    backgroundAlt: background.alt,
    fromCms: Boolean(section),
  };
}
