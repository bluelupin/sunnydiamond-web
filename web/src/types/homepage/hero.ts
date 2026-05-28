export type StrapiMedia = {
  data?: {
    attributes?: {
      url?: string;
      alternativeText?: string | null;
      width?: number | null;
      height?: number | null;
    };
  } | null;
};

export type HeroSectionData = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?:string;
    cta?: { label?: string; to?: string };
    image?: StrapiMedia;
  };
};

