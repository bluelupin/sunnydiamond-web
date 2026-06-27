export function resolveHeaderNavHref(label: string, url: string): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel === "jewellery" || normalizedLabel === "jewelry") {
    return "/jewellery";
  }

  return url;
}

export function isJewelleryNavLink(label: string): boolean {
  const normalizedLabel = label.trim().toLowerCase();
  return normalizedLabel === "jewellery" || normalizedLabel === "jewelry";
}

/** Routes where the hero uses a transparent header treatment at the top of the page. */
export function isHeroOverlayRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/education" ||
    pathname === "/jewellery"
  );
}

export type HeaderVariant = "overlay" | "solid";

/** Figma 692:6742 — solid white header on PDP and other non-hero pages. */
export function getHeaderVariant(
  pathname: string,
  options: { scrolled?: boolean; menuOpen?: boolean } = {},
): HeaderVariant {
  const { scrolled = false, menuOpen = false } = options;

  if (isHeroOverlayRoute(pathname) && !scrolled && !menuOpen) {
    return "overlay";
  }

  return "solid";
}

export function shouldOffsetMainForHeader(pathname: string): boolean {
  return !isHeroOverlayRoute(pathname);
}
