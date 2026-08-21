import type { ProfileSection } from "../types";

export type ProfileNavItem =
  | { kind: "section"; id: ProfileSection["id"]; label: string }
  | { kind: "link"; href: string; label: string };

export const VALID_PROFILE_SECTION_IDS = [
  "details",
  "orders",
  "addresses",
  "wishlist",
  "appointments",
  "diamonds_for_everyone",
  "bespoke",
  "support",
] as const satisfies readonly ProfileSection["id"][];

export const DEFAULT_PROFILE_SECTION: ProfileSection["id"] = "orders";

export function isProfileSectionId(value: string | null | undefined): value is ProfileSection["id"] {
  return VALID_PROFILE_SECTION_IDS.some((sectionId) => sectionId === value);
}

const PROFILE_SECTION_MOBILE_TITLES: Record<ProfileSection["id"], string> = {
  details: "Profile",
  orders: "My Orders",
  addresses: "My Addresses",
  wishlist: "My Wishlist",
  appointments: "My Appointments",
  diamonds_for_everyone: "Diamonds for Everyone",
  bespoke: "Bespoke Inspirations",
  support: "Help & Support",
};

export function getProfileSectionMobileTitle(id: ProfileSection["id"]): string {
  return PROFILE_SECTION_MOBILE_TITLES[id];
}
