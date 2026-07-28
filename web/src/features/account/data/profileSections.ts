import type { ProfileSection } from "../types";

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: "details",
    label: "PROFILE",
    description: "View and manage your personal details.",
  },
  {
    id: "orders",
    label: "MY ORDERS",
    description: "Track purchases and order history.",
  },
  {
    id: "addresses",
    label: "MY ADDRESSES",
    description: "Manage saved delivery addresses.",
  },
  {
    id: "appointments",
    label: "MY APPOINTMENTS",
    description: "View and book showroom visits.",
  },
  {
    id: "bespoke",
    label: "BESPOKE INSPIRATIONS",
    description: "Explore custom jewellery ideas and consultations.",
  },
  {
    id: "support",
    label: "HELP & SUPPORT",
    description: "Get help with orders, returns, and services.",
  },
];

export type ProfileNavItem =
  | { kind: "section"; id: ProfileSection["id"]; label: string }
  | { kind: "link"; href: string; label: string };

export const PROFILE_NAV_ITEMS: ProfileNavItem[] = [
  { kind: "section", id: "details", label: "PROFILE" },
  { kind: "section", id: "orders", label: "MY ORDERS" },
  { kind: "section", id: "addresses", label: "MY ADDRESSES" },
  { kind: "link", href: "/wishlist", label: "MY WISHLIST" },
  { kind: "section", id: "appointments", label: "MY APPOINTMENTS" },
  { kind: "link", href: "/diamonds-for-everyone", label: "DIAMONDS FOR EVERYONE" },
  { kind: "section", id: "bespoke", label: "BESPOKE INSPIRATIONS" },
  { kind: "section", id: "support", label: "HELP & SUPPORT" },
];

export const DEFAULT_PROFILE_SECTION = PROFILE_SECTIONS[0].id;

export function isProfileSectionId(value: string | null | undefined): value is ProfileSection["id"] {
  return PROFILE_SECTIONS.some((section) => section.id === value);
}

export function getProfileSection(id: ProfileSection["id"]): ProfileSection {
  return PROFILE_SECTIONS.find((section) => section.id === id) ?? PROFILE_SECTIONS[0];
}

const PROFILE_SECTION_MOBILE_TITLES: Record<ProfileSection["id"], string> = {
  details: "Profile",
  orders: "My Orders",
  addresses: "My Addresses",
  appointments: "My Appointments",
  bespoke: "Bespoke Inspirations",
  support: "Help & Support",
};

export function getProfileSectionMobileTitle(id: ProfileSection["id"]): string {
  return PROFILE_SECTION_MOBILE_TITLES[id];
}
