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

const REMOVED_HEADER_NAV_LABELS = new Set(["collection"]);

const DEFAULT_APPOINTMENT_LINK: HeaderNavLink = {
  label: "Book an Appointment",
  url: "/book-an-appointment",
};

export function isBookAppointmentNavLink(link: HeaderNavLink): boolean {
  const label = link.label.trim().toLowerCase();
  const url = link.url.replace(/\/$/, "") || "/";
  return label === "book an appointment" || url === "/book-an-appointment";
}

function filterHeaderLinks(links: readonly HeaderNavLink[]): HeaderNavLink[] {
  return links.filter(
    (link) => !REMOVED_HEADER_NAV_LABELS.has(link.label.trim().toLowerCase()),
  );
}

export function resolveShellHeaderLinks(
  cmsLinks: readonly HeaderNavLink[] | null | undefined,
): HeaderNavLink[] {
  if (cmsLinks?.length) return filterHeaderLinks(cmsLinks);
  return filterHeaderLinks(getFallbackHeaderLinks());
}

/** Primary nav links with Book an Appointment extracted for the dedicated CTA slot. */
export function splitShellHeaderNavLinks(links: readonly HeaderNavLink[]): {
  primaryLinks: HeaderNavLink[];
  appointmentLink: HeaderNavLink;
} {
  const appointmentLink =
    links.find((link) => isBookAppointmentNavLink(link)) ?? DEFAULT_APPOINTMENT_LINK;
  const primaryLinks = links.filter((link) => !isBookAppointmentNavLink(link));
  return { primaryLinks, appointmentLink };
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
