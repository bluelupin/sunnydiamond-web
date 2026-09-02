import type { CraftingBrillianceSectionData } from "./craftingBrillianceSection";
import type { BespokeForYouSectionData } from "./bespokeForYouSection";
import type { CraftsmanshipStepsSection } from "./craftsmanshipSteps";
import type { DiamondsForEveryoneSectionData } from "./diamondsForEveryoneSection";
import type { OccasionSection } from "./occasionSection";
import type { ShowroomTeaser } from "./showroomTeaser";
import type { StrapiMedia } from "./hero";
import type { CategoryNavigationCta, CategoryNavigationImage } from "./categoryNavigation";

export type SunnyPromiseSectionData = {
  id?: number | null;
  sectionTitle?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  cta?: CategoryNavigationCta | null;
  posterImage?: StrapiMedia | null;
  videoUrl?: string | null;
};

export type DiamondSourcingSectionData = {
  id?: number | null;
  sectionTitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
  gifOrImage?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
  backgroundImage?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
};

export type CraftsmanshipSectionData = CraftsmanshipStepsSection & {
  sectionTitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
  backgroundImage?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
};

export type BespokeForYouCard = {
  id?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  sortOrder?: number;
  isActive?: boolean;
  image?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
  };
  cta?: {
    id?: number;
    label?: string;
    url?: string;
    targetType?: "internal" | "external";
    openInNewTab?: boolean;
  };
};

export type ShowroomSectionLocation = {
  id?: number | null;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  directionsUrl?: string | null;
  mapUrl?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  image?: CategoryNavigationImage | null;
};

export type ShowroomSectionData = {
  id?: number | null;
  sectionTitle?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showrooms?: ShowroomSectionLocation[] | null;
};

export type HomepageEditorialBlocksData = {
  sunnyPromiseSection?: SunnyPromiseSectionData | null;
  occasionSection?: OccasionSection | null;
  craftsmanshipSection?: CraftsmanshipSectionData | null;
  diamondSourcingSection?: DiamondSourcingSectionData | null;
  bespokeForYouSection?: BespokeForYouSectionData | null;
  diamondsForEveryoneSection?: DiamondsForEveryoneSectionData | null;
  bespokeForYouCards?: BespokeForYouCard[] | null;
  showroomTeaser?: ShowroomTeaser | null;
  showroomSection?: ShowroomSectionData | null;
  craftingBrillianceSection?: CraftingBrillianceSectionData | null;
  homepage?: {
    craftsmanshipSection?: CraftsmanshipSectionData | null;
  } | null;
};
