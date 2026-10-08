import { resolveFooterLinkHref } from "@/features/cms/utils/policyCertificationsRoutes";

export type HeaderNavCta = {
  id?: string | number;
  label: string;
  url: string;
  targetType?: string | null;
  openInNewTab?: boolean;
};

/** Mega-menu card on a header nav item (e.g. World of Sunny). Title from CMS is ignored — use `cta.label`. */
export type HeaderNavCard = {
  id: string | number;
  isActive?: boolean;
  cta: HeaderNavCta;
  image: {
    id?: string | number;
    desktopImageUrl?: string;
    mobileImageUrl?: string;
    alt?: string;
  };
};

export type HeaderNavLink = {
  id?: string | number;
  label: string;
  url: string;
  targetType?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  sortOrder?: number | null;
  cards?: HeaderNavCard[];
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

export function isBookAppointmentLink(link: { label: string; url: string }): boolean {
  const label = link.label.trim().toLowerCase();
  const url = link.url.replace(/\/$/, "") || "/";
  return label === "book an appointment" || url === "/book-an-appointment";
}

export function isBookAppointmentNavLink(link: HeaderNavLink): boolean {
  return isBookAppointmentLink(link);
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
      targetType: link.targetType,
      cards: link.cards?.length ? link.cards : undefined,
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
          url: resolveFooterLinkHref(link.url.trim()),
        })),
    }))
    .filter((group) => group.links.length > 0);
}
