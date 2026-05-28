import type { StrapiMedia } from "./hero";

export type CraftsmanshipStep = {
  id?: number;
  number?: string;
  title?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type CraftsmanshipStepsSection = {
  id?: number;
  title?: string;
  steps?: CraftsmanshipStep[];
  diamondImage?: StrapiMedia;
};

export type CraftsmanshipStepsData = {
  craftsmanshipSteps?: CraftsmanshipStepsSection | null;
};

