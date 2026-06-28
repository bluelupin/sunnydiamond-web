import { siteConfig } from "@/shared/lib/siteConfig";

export type HeaderNavLink = {
  label: string;
  url: string;
};

export type FooterLink = {
  id: string;
  label: string;
  url: string;
};

export type FooterLinkGroup = {
  id: string | number;
  title: string;
  links: FooterLink[];
};

export function getFallbackHeaderLinks(): HeaderNavLink[] {
  return siteConfig.navigation.main.map(({ label, to }) => ({
    label,
    url: to,
  }));
}

export function getFallbackFooterLinkGroups(): FooterLinkGroup[] {
  return siteConfig.navigation.footer.columns.map((column, columnIndex) => ({
    id: columnIndex,
    title: column.heading,
    links: column.links.map((link, linkIndex) => ({
      id: `${columnIndex}-${linkIndex}`,
      label: link.label,
      url: link.to,
    })),
  }));
}

export function resolveShellHeaderLinks(
  cmsLinks: readonly HeaderNavLink[] | null | undefined,
): HeaderNavLink[] {
  if (cmsLinks?.length) return [...cmsLinks];
  return getFallbackHeaderLinks();
}

const REMOVED_FOOTER_PATHS = new Set([
  "/blogs",
  "/help-and-support",
  "/monthly-plans",
  "/gift-card",
  "/finance-options",
  "/policy-and-certification",
]);

function isRemovedFooterLink(link: FooterLink): boolean {
  const normalized = link.url.replace(/\/$/, "") || "/";
  if (REMOVED_FOOTER_PATHS.has(normalized) || normalized.startsWith("/blogs")) {
    return true;
  }

  return /\bblog(s)?\b/i.test(link.label);
}

function filterFooterLinks(groups: readonly FooterLinkGroup[]): FooterLinkGroup[] {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => !isRemovedFooterLink(link)),
    }))
    .filter((group) => group.links.length > 0);
}

export function resolveShellFooterLinkGroups(
  cmsGroups: readonly FooterLinkGroup[] | null | undefined,
): FooterLinkGroup[] {
  if (cmsGroups?.length) return filterFooterLinks(cmsGroups);
  return filterFooterLinks(getFallbackFooterLinkGroups());
}
