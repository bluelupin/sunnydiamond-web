import type { StrapiMedia } from "./hero";

export type BespokeForYouCard = {
  id?: number;
  sectionTitle?: string;
  subtitle?: string;
  image?: StrapiMedia;
  sortOrder?: number;
  isActive?: boolean;
};

export type BespokeForYouCardsSection = {
  id?: number;
  sectionTitle?: string;
  cards?: BespokeForYouCard[];
};

export type BespokeForYouCardsData = {
  bespokeForYouCards?: BespokeForYouCardsSection | null;
};

