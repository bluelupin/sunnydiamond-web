/** Shared sticky offset for PDP gallery + purchase blocks (below fixed header). */
export const PDP_STICKY_TOP_CLASS = "top-6 lg:top-8";

/** Fixed lifestyle image heights — must match ProductDetailGallery Tailwind classes. */
export const PDP_LIFESTYLE_HEIGHT_MD_PX = 520;
export const PDP_LIFESTYLE_HEIGHT_LG_PX = 680;

export const getPdpLifestyleHeightPx = (): number =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
    ? PDP_LIFESTYLE_HEIGHT_LG_PX
    : PDP_LIFESTYLE_HEIGHT_MD_PX;

/** gap-3 between gallery sections */
export const PDP_GALLERY_SECTION_GAP_PX = 12;
