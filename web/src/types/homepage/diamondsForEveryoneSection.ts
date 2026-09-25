export type SavingsPlanStep = {
  id?: number;
  stepNumber?: number;
  label?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type DiamondsForEveryoneSectionCta = {
  label?: string;
  url?: string;
  to?: string;
};

export type DiamondsForEveryoneSectionData = {
  id?: number;
  eyebrow?: string;
  sectionTitle?: string;
  subtitle?: string;
  description?: string;
  steps?: SavingsPlanStep[];
  cta?: DiamondsForEveryoneSectionCta;
  isActive?: boolean;
  showField?: boolean;
  backgroundImage?: {
    desktopImage?: unknown;
    mobileImage?: unknown;
    altText?: string;
  } | null;
};

export type DiamondsForEveryoneSectionResponse = {
  diamondsForEveryoneSection?: DiamondsForEveryoneSectionData | null;
};
