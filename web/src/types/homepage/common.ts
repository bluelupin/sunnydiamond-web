import type { StrapiMedia } from "./hero";

export type CmsCta = {
  label?: string;
  to?: string;
};

export type CmsImage = StrapiMedia;

export type CmsProduct = {
  id?: string | number;
  name?: string;
  price?: number;
  category?: string;
  image?: CmsImage;
};

