import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import { siteConfig } from "@/shared/lib/siteConfig";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

function buildJewelryStoreNode(store: BookStoreVisitStore) {
  return {
    "@type": "JewelryStore",
    name: `${siteConfig.brand.name} ${store.storeName}`,
    image: getAbsoluteUrl(store.heroImage),
    telephone: store.phone,
    url: store.directionsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressCountry: "IN",
    },
  };
}

export function buildStoreLocatorJsonLd(stores: BookStoreVisitStore[]) {
  if (stores.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@graph": stores.map(buildJewelryStoreNode),
  };
}
