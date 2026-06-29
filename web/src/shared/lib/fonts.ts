import localFont from "next/font/local";

export const inter = {
  variable: "font-inter-variable",
} as const;

export const playfairDisplay = localFont({
  src: "../../assets/fonts/PlayfairDisplay-Regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-playfair",
});
