export type ProfileSectionId =
  | "details"
  | "orders"
  | "addresses"
  | "wishlist"
  | "appointments"
  | "bespoke"
  | "support";

export type ProfileSection = {
  id: ProfileSectionId;
  label: string;
  description: string;
};
