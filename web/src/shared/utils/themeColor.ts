import type { HeaderVariant } from "@/shared/utils/navigation";

/** Matches root viewport theme_color. */
export const THEME_COLORS = {
  brand: "#C6A87D",
  white: "#FFFFFF",
  gray300: "#F4F3EE",
  page: "#FFFDF7",
} as const;

export function resolveMobileThemeColor(
  pathname: string,
  headerVariant: HeaderVariant,
): string {
  if (headerVariant === "overlay") {
    return THEME_COLORS.brand;
  }

  if (pathname === "/cart" || pathname === "/checkout") {
    return THEME_COLORS.gray300;
  }

  return THEME_COLORS.white;
}
