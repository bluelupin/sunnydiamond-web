export function resolveHeaderNavHref(label: string, url: string): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel === "jewellery" || normalizedLabel === "jewelry") {
    return "/jewellery-product";
  }

  return url;
}

/** Routes where the hero sits beneath a transparent fixed header (homepage-style overlay). */
export function isHeroOverlayRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/about";
}
