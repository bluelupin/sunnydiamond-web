export type ProfileSectionId =
  | "details"
  | "orders"
  | "addresses"
  | "appointments"
  | "bespoke"
  | "support";

export type ProfileSection = {
  id: ProfileSectionId;
  label: string;
  description: string;
};
