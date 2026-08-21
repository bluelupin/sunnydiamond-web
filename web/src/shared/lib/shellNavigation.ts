export type HeaderNavLink = {
  id?: string | number;
  label: string;
  url: string;
  isActive?: boolean | null;
  showField?: boolean | null;
  sortOrder?: number | null;
};

export type FooterLink = {
  id: string | number;
  label: string;
  url: string;
  isActive?: boolean | null;
  sortOrder?: number | null;
};

export type FooterLinkGroup = {
  id: string | number;
  title: string;
  links: FooterLink[];
  isActive?: boolean | null;
  sortOrder?: number | null;
};

export type SidebarNavigationItem = {
  id?: string | number;
  label?: string | null;
  sectionId?: string | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
};

export type HomeSidebarNavSection = {
  id: string | number;
  label: string;
  sectionId: string;
};

const REMOVED_HEADER_NAV_LABELS = new Set(["collection"]);

export function isBookAppointmentNavLink(link: HeaderNavLink): boolean {
  const label = link.label.trim().toLowerCase();
  const url = link.url.replace(/\/$/, "") || "/";
  return label === "book an appointment" || url === "/book-an-appointment";
}

function filterHeaderLinks(links: readonly HeaderNavLink[]): HeaderNavLink[] {
  return [...links]
    .filter(
      (link) =>
        link.isActive !== false &&
        link.showField !== false &&
        Boolean(link.label?.trim()) &&
        Boolean(link.url?.trim()) &&
        !REMOVED_HEADER_NAV_LABELS.has(link.label.trim().toLowerCase()),
    )
    .map((link) => ({
      id: link.id,
      label: link.label.trim(),
      url: link.url.trim(),
    }));
}

export function resolveShellHeaderLinks(
  cmsLinks: readonly HeaderNavLink[] | null | undefined,
): HeaderNavLink[] {
  if (!cmsLinks?.length) {
    return [];
  }

  return filterHeaderLinks(cmsLinks);
}

/** Primary nav links with Book an Appointment extracted for the dedicated CTA slot. */
export function splitShellHeaderNavLinks(links: readonly HeaderNavLink[]): {
  primaryLinks: HeaderNavLink[];
  appointmentLink?: HeaderNavLink;
} {
  const appointmentLink = links.find((link) => isBookAppointmentNavLink(link));
  const primaryLinks = links.filter((link) => !isBookAppointmentNavLink(link));
  return { primaryLinks, appointmentLink };
}

export function resolveShellSidebarNavigation(
  items: readonly SidebarNavigationItem[] | null | undefined,
): HomeSidebarNavSection[] {
  if (!items?.length) {
    return [];
  }

  return items
    .filter(
      (item) =>
        item.isActive !== false &&
        Boolean(item.label?.trim()) &&
        Boolean(item.sectionId?.trim()),
    )
    .map((item) => ({
      id: item.id ?? item.sectionId!.trim(),
      label: item.label!.trim(),
      sectionId: item.sectionId!.trim(),
    }));
}

export function resolveShellFooterLinkGroups(
  cmsGroups: readonly FooterLinkGroup[] | null | undefined,
): FooterLinkGroup[] {
  if (!cmsGroups?.length) {
    return [];
  }

  return [...cmsGroups]
    .filter((group) => group.isActive !== false)
    .map((group) => ({
      id: group.id,
      title: group.title,
      links: group.links
        .filter(
          (link) =>
            link.isActive !== false &&
            Boolean(link.label?.trim()) &&
            Boolean(link.url?.trim()),
        )
        .map((link) => ({
          id: link.id,
          label: link.label.trim(),
          url: link.url.trim(),
        })),
    }))
    .filter((group) => group.links.length > 0);
}
