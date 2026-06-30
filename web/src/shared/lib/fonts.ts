import localFont from "next/font/local";

export const inter = {
  variable: "font-inter-variable",
} as const;

export const playfairDisplay = localFont({
  src: "../../assets/fonts/PlayfairDisplay-Regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-playfair",
  /** Fallback only (behind Larken); headings use font-light (300) so preload is unused. */
  preload: false,
});
