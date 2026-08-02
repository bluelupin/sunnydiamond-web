export type ProfileSectionId =
  | "details"
  | "orders"
  | "addresses"
  | "wishlist"
  | "appointments"
  | "diamonds_for_everyone"
  | "bespoke"
  | "support";

export type ProfileSection = {
  id: ProfileSectionId;
  label: string;
  description: string;
};
