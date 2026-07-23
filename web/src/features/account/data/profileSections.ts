import type { ProfileSection } from "../types";

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: "details",
    label: "Profile Details",
    description: "View your account information.",
  },
  {
    id: "orders",
    label: "My Orders",
    description: "Track purchases and order history.",
  },
  {
    id: "addresses",
    label: "My Addresses",
    description: "Manage saved delivery addresses.",
  },
  {
    id: "appointments",
    label: "My Appointments",
    description: "View and book showroom visits.",
  },
  {
    id: "bespoke",
    label: "Bespoke Inspirations",
    description: "Explore custom jewellery ideas and consultations.",
  },
  {
    id: "support",
    label: "Help & Support",
    description: "Get help with orders, returns, and services.",
  },
];

export const DEFAULT_PROFILE_SECTION = PROFILE_SECTIONS[0].id;

export function isProfileSectionId(value: string | null | undefined): value is ProfileSection["id"] {
  return PROFILE_SECTIONS.some((section) => section.id === value);
}

export function getProfileSection(id: ProfileSection["id"]): ProfileSection {
  return PROFILE_SECTIONS.find((section) => section.id === id) ?? PROFILE_SECTIONS[0];
}
