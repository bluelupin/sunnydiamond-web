export const DELIVERY_STORE_MAP_IMAGES = {
  base: "/images/delivery-store/map-base.png",
  overlay1: "/images/delivery-store/map-overlay-1.png",
  overlay2: "/images/delivery-store/map-overlay-2.png",
} as const;

export const DELIVERY_STORE_ICONS = {
  store: "/icons/store-icon.svg",
  address: "/icons/address-icon.svg",
  phone: "/icons/phone-icon.svg",
} as const;

export type DeliveryStoreLocation = {
  name: string;
  slug: string;
};

// Magento returns a feed code. The showroom API identifies the same location by slug.
const DELIVERY_STORE_LOCATIONS = new Map<string, DeliveryStoreLocation>([
  ["CBE", { name: "Coimbatore", slug: "coimbatore" }],
  ["CHE", { name: "Chennai", slug: "chennai" }],
  ["CLT", { name: "Calicut", slug: "calicut" }],
  ["EKM", { name: "Kochi", slug: "kochi" }],
  ["TCR", { name: "Thrissur", slug: "thrissur" }],
  ["TVM", { name: "Trivandrum", slug: "trivandrum" }],
]);

export function getDeliveryStoreLocation(storeCode?: string): DeliveryStoreLocation | undefined {
  return DELIVERY_STORE_LOCATIONS.get(storeCode ?? "");
}
