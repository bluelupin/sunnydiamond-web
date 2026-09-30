import type { HeaderVariant } from "@/shared/utils/navigation";

/** Matches root viewport theme_color. */
export const THEME_COLORS = {
  brand: "#C6A87D",
  white: "#FFFFFF",
  gray200: "#FBFAF6",
  gray300: "#F4F3EE",
  page: "#FFFDF7",
} as const;

type ResolveMobileThemeColorOptions = {
  isCartEmptyPageShell?: boolean;
  isCheckoutSuccessScreen?: boolean;
};

export function resolveMobileThemeColor(
  pathname: string,
  headerVariant: HeaderVariant,
  options: ResolveMobileThemeColorOptions = {},
): string {
  if (headerVariant === "overlay") {
    return THEME_COLORS.brand;
  }

  if (pathname === "/cart" || pathname === "/checkout") {
    if (pathname === "/checkout" && options.isCheckoutSuccessScreen) {
      return THEME_COLORS.white;
    }

    if (pathname === "/cart" && options.isCartEmptyPageShell) {
      return THEME_COLORS.gray200;
    }

    return THEME_COLORS.gray300;
  }

  return THEME_COLORS.white;
}
