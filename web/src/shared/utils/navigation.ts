export function resolveHeaderNavHref(label: string, url: string): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel === "jewellery" || normalizedLabel === "jewelry") {
    return "/jewellery-product";
  }

  return url;
}

/** Routes where the hero uses a transparent header treatment at the top of the page. */
export function isHeroOverlayRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/about" || pathname === "/education";
}
