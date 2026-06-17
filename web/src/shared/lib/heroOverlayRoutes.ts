/** Routes that use a full-bleed hero with transparent header overlay. */
export const HERO_OVERLAY_ROUTES = ["/", "/about"] as const;

export function isHeroOverlayRoute(pathname: string): boolean {
  return HERO_OVERLAY_ROUTES.includes(pathname as (typeof HERO_OVERLAY_ROUTES)[number]);
}
