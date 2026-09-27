export type BookStoreVisitStore = {
  id: string;
  /** Strapi showroom documentId — required for preferredShowroom relation on submit */
  documentId?: string;
  tabLabel: string;
  storeName: string;
  address: string;
  phone: string;
  directionsUrl: string;
  heroImage?: string;
  mobileHeroImage?: string;
  imageAlt?: string;
  city?: string;
  state?: string;
  pincode?: string;
  openingHours?: string;
  /** Store-locator showrooms only; absent coordinates keep a store out of distance results. */
  latitude?: number | null;
  longitude?: number | null;
};
