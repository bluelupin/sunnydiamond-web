import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppProvider from "@/lib/providers/AppProvider";
import siteEnv, { getAbsoluteUrl } from "@/lib/seo/siteConfig";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#C6A87D",
};

const TITLE = {
  default: "Sunny Diamonds - Premium Diamond Jewellery",
  template: "%s | Sunny Diamonds",
} as const;

const DESCRIPTION =
  "Handcrafted premium and custom diamond jewellery. Explore GIA-certified diamonds, bespoke designs, and timeless elegance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["diamond", "jewelry", "premium", "luxury", "sunny diamonds"],
  authors: [{ name: "Sunny Diamonds" }],
  creator: "Sunny Diamonds",
  metadataBase: new URL(siteEnv.baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteEnv.baseUrl,
    siteName: "Sunny Diamonds",
    title: TITLE.default,
    description: DESCRIPTION,
    images: [
      {
        url: getAbsoluteUrl("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: "Sunny Diamond",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE.default,
    description: DESCRIPTION,
    images: [getAbsoluteUrl("/og-image.jpg")],
  },
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon.ico",
  //   apple: "/favicon.ico",
  // },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: siteEnv.indexing,
    follow: true,
  },
  alternates: {
    canonical: siteEnv.baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background font-body">
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
