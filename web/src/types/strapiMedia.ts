export type StrapiMediaAttributes = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiMediaData = {
  data?: {
    attributes?: StrapiMediaAttributes | null;
  } | null;
};

export type StrapiImage = StrapiMediaAttributes | StrapiMediaData | null;
export type StrapiImagePayload = StrapiMediaAttributes | null;
