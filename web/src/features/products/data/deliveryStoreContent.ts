export const DELIVERY_STORE_MAP_IMAGES = {
  base: "/images/products/delivery-store/map-base.png",
  overlay1: "/images/products/delivery-store/map-overlay-1.png",
  overlay2: "/images/products/delivery-store/map-overlay-2.png",
} as const;

export type DeliveryStoreLocation = {
  cityLabel: string;
  address: string;
  phone: string;
  collectionHref: string;
};

export const DELIVERY_STORE_LOCATIONS: Record<string, DeliveryStoreLocation> = {
  Coimbatore: {
    cityLabel: "COIMBATORE",
    address: "Sunny Diamonds Kochi 40/9134 B & C, Rajaji Rd Ernakulam, Kerala 682035",
    phone: "+91 97443 55555",
    collectionHref: "/jewellery",
  },
};
