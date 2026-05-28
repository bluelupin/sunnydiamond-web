import type { StrapiMedia } from "./hero";

export type DiamondSourcingSection = {
  id?: number;
  sectionTitle?: string;
  description?: string;
  isActive?: boolean;
  backgroundImage?: StrapiMedia;
  diamondImage?: StrapiMedia;
  iconImage?: StrapiMedia;
};

export type DiamondSourcingData = {
  diamondSourcingSection?: DiamondSourcingSection | null;
};

