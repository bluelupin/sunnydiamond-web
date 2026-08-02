/**
 * Homepage cache TTLs — keep segment `revalidate` literals in route files in sync.
 *
 * CMS (Strapi): shell, editorial, shopping — refreshed frequently.
 * Trending (Magento): long-lived catalog scan — see MAGENTO_CATALOG_REVALIDATE_SECONDS.
 */

/** Strapi homepage CMS ISR — `app/(home)/page.tsx` revalidate. */
export const HOMEPAGE_CMS_REVALIDATE_SECONDS = 300;
