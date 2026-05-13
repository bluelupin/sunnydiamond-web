import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppProvider from "@/lib/providers/AppProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Sunny Diamond | Premium Jewelry",
    template: "%s | Sunny Diamond",
  },
  description: "Experience the finest collection of diamonds and premium jewelry at Sunny Diamond.",
  keywords: ["diamond", "jewelry", "premium", "luxury", "sunny diamond"],
  authors: [{ name: "Sunny Diamond" }],
  creator: "Sunny Diamond",
  metadataBase: new URL("https://sunnydiamond.com"), // Placeholder
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sunnydiamond.com",
    siteName: "Sunny Diamond",
    title: "Sunny Diamond | Premium Jewelry",
    description: "Experience the finest collection of diamonds and premium jewelry at Sunny Diamond.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sunny Diamond",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunny Diamond | Premium Jewelry",
    description: "Experience the finest collection of diamonds and premium jewelry at Sunny Diamond.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
