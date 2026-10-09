import type { HeaderNavCard, HeaderNavLink } from "@/shared/lib/shellNavigation";
import { isWorldOfSunnyNavLink } from "@/shared/utils/navigation";

export type WorldOfSunnyNavItem = HeaderNavCard;

/** Mega-menu cards from the World of Sunny entry in `api/homepage/shell` → `headerNavigationLinks`. */
export function resolveWorldOfSunnyNavItems(
  cmsLinks: readonly HeaderNavLink[] | null | undefined,
): WorldOfSunnyNavItem[] {
  const worldOfSunnyLink = cmsLinks?.find((link) => isWorldOfSunnyNavLink(link.label, link.url));
  return worldOfSunnyLink?.cards ?? [];
}

export function resolveShellHeaderNavigationLinks(
  shell?: {
    global?: { headerNavigationLinks?: HeaderNavLink[] | null } | null;
    headerNavigationLinks?: HeaderNavLink[] | null;
  } | null,
): HeaderNavLink[] | null | undefined {
  return shell?.global?.headerNavigationLinks ?? shell?.headerNavigationLinks;
}
