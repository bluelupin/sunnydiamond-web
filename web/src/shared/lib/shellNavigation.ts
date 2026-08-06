import { siteConfig } from "@/shared/lib/siteConfig";
import {
  buildPolicyCertificationsHref,
  resolvePolicyIdFromFooterPath,
  resolvePolicyIdFromParam,
} from "@/features/cms/utils/policyCertificationsRoutes";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";

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
  "/help-and-support",
  "/monthly-plans",
  "/gift-card",
  "/finance-options",
  "/news",
  "/old-gold-purchase-policy-kerala-only",
]);

function isRemovedFooterLink(link: FooterLink): boolean {
  const normalized = link.url.replace(/\/$/, "") || "/";
  if (REMOVED_FOOTER_PATHS.has(normalized)) {
    return true;
  }

  if (normalized.startsWith("/blogs/")) {
    return false;
  }

  if (/\bblog(s)?\b/i.test(link.label) && normalized !== "/blogs") {
    return true;
  }

  return false;
}

function normalizeFooterLink(link: FooterLink): FooterLink {
  const normalizedUrl = link.url.replace(/\/$/, "") || "/";
  const normalizedLabel = link.label.trim().toLowerCase();
  const pathOnly = normalizedUrl.split("?")[0] || "/";
  const policyQueryMatch = link.url.match(/[?&]policy=([^&]+)/);
  const policyIdFromQuery = resolvePolicyIdFromParam(
    policyQueryMatch ? decodeURIComponent(policyQueryMatch[1]) : undefined,
  );

  if (normalizedUrl === "/about" || normalizedLabel === "about us") {
    return {
      ...link,
      label: "World of Sunny",
      url: WORLD_OF_SUNNY_PATH,
    };
  }

  const policyId = policyIdFromQuery ?? resolvePolicyIdFromFooterPath(pathOnly);
  if (policyId) {
    return {
      ...link,
      label: policyId === "privacy-policy" ? "Privacy Policy" : link.label,
      url: buildPolicyCertificationsHref(policyId),
    };
  }

  if (
    pathOnly === "/policy-and-certifications" ||
    pathOnly === "/policy-and-certification" ||
    pathOnly === "/privacy-policy" ||
    normalizedLabel === "privacy policy"
  ) {
    return {
      ...link,
      label: "Privacy Policy",
      url: buildPolicyCertificationsHref("privacy-policy"),
    };
  }

  if (normalizedLabel === "policy & certifications" || normalizedLabel === "policy and certifications") {
    return {
      ...link,
      label: "Privacy Policy",
      url: buildPolicyCertificationsHref("privacy-policy"),
    };
  }

  return link;
}

function dedupeFooterLinks(links: FooterLink[]): FooterLink[] {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.url)) {
      return false;
    }

    seen.add(link.url);
    return true;
  });
}

function filterFooterLinks(groups: readonly FooterLinkGroup[]): FooterLinkGroup[] {
  return groups
    .map((group) => ({
      ...group,
      links: dedupeFooterLinks(
        group.links
          .map(normalizeFooterLink)
          .filter((link) => !isRemovedFooterLink(link)),
      ),
    }))
    .filter((group) => group.links.length > 0);
}

export function resolveShellFooterLinkGroups(
  cmsGroups: readonly FooterLinkGroup[] | null | undefined,
): FooterLinkGroup[] {
  if (!cmsGroups?.length) {
    return [];
  }

  return filterFooterLinks(cmsGroups);
}
