/** Fallback when CMS purpose dropdown options are not configured. */
export const DEFAULT_STORE_VISIT_PURPOSE_OPTIONS = [
  "Engagement ring",
  "Wedding band",
  "Everyday jewellery",
  "Gift",
  "Repair or resizing",
  "Other",
] as const;

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

/** Figma 4903:39795 — city on chalk overlay (Desktop/Heading/h4-20-Light). */
export const bookStoreVisitOverlayCardTitleClassName =
  "font-larken text-xl font-light leading-110 text-darkblack";

/** Figma 4903:39801 / 4903:39804 — address & phone (Desktop/Body/b2-16-Light). */
export const bookStoreVisitOverlayDetailTextClassName =
  "min-w-0 flex-1 break-words font-gill text-base font-light leading-110 text-darkblack";

export function getBookStoreVisitOverlayTitle(store: BookStoreVisitStore): string {
  const city = store.city?.trim();
  if (city) return city;

  const tab = store.tabLabel?.trim();
  if (tab) {
    return tab
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return store.storeName;
}
