export function resolveHeaderNavHref(label: string, url: string): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel === "jewellery" || normalizedLabel === "jewelry") {
    return "/jewellery";
  }

  if (normalizedLabel === "bespoke") {
    return "/bespoke-jewellery";
  }

  if (normalizedLabel === "gifting") {
    return "/gifting";
  }

  return url;
}

export function isJewelleryNavLink(label: string): boolean {
  const normalizedLabel = label.trim().toLowerCase();
  return normalizedLabel === "jewellery" || normalizedLabel === "jewelry";
}

export function isAuthRoute(pathname: string): boolean {
  return pathname === "/login" || pathname === "/sign-up";
}

/** Routes where the hero uses a transparent header treatment at the top of the page. */
export function isHeroOverlayRoute(pathname: string): boolean {
  return (
    isAuthRoute(pathname) ||
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/education" ||
    pathname === "/jewellery" ||
    pathname.startsWith("/jewellery/") ||
    pathname === "/bespoke-jewellery" ||
    pathname === "/gifting" ||
    pathname === "/careers" ||
    pathname === "/contact"
  );
}

export type HeaderVariant = "overlay" | "solid";

/** Figma 692:6742 — solid white header on PDP and other non-hero pages. */
export function getHeaderSurfaceClass(
  pathname: string,
  headerVariant: HeaderVariant,
): string {
  if (headerVariant === "overlay") {
    return "bg-transparent";
  }

  if (pathname === "/cart" || pathname === "/checkout") {
    return "bg-gray300";
  }

  return "bg-white";
}

export function getHeaderVariant(
  pathname: string,
  options: { menuOpen?: boolean } = {},
): HeaderVariant {
  const { menuOpen = false } = options;

  if (menuOpen) {
    return "solid";
  }

  if (isAuthRoute(pathname)) {
    return "overlay";
  }

  if (isHeroOverlayRoute(pathname)) {
    return "overlay";
  }

  return "solid";
}

export function shouldOffsetMainForHeader(pathname: string): boolean {
  return !isHeroOverlayRoute(pathname);
}

export function isCartOrCheckoutRoute(pathname: string): boolean {
  return pathname === "/cart" || pathname === "/checkout";
}

export function shouldHideFooter(pathname: string): boolean {
  return isAuthRoute(pathname);
}

/** Cart/checkout use a sticky mobile action bar; hide the site footer below md. */
export function shouldHideFooterOnMobile(pathname: string): boolean {
  return isCartOrCheckoutRoute(pathname);
}

/** Reset scroll before client navigation so route loading skeletons do not flash the footer. */
export function scrollToTopBeforeClientNavigation() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function shouldPreventClientNavigation(event: {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
}) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}
