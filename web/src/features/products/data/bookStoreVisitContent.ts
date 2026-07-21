export type BookStoreVisitStore = {
  id: string;
  /** Strapi showroom documentId — required for preferredShowroom relation on submit */
  documentId?: string;
  tabLabel: string;
  storeName: string;
  address: string;
  phone: string;
  directionsUrl: string;
  heroImage: string;
};

export const BOOK_STORE_VISIT_STORES: BookStoreVisitStore[] = [
  {
    id: "kochi",
    tabLabel: "KOCHI",
    storeName: "Kochi",
    address: "Sunny Diamonds Kochi 40/9134 B & C, Rajaji Rd Ernakulam, Kerala 682035",
    phone: "+91 97443 55555",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sunny+Diamonds+Kochi+Rajaji+Rd+Ernakulam",
    heroImage: "/images/products/delivery-store/book-visit-hero.png",
  },
  {
    id: "calicut",
    tabLabel: "CALICUT",
    storeName: "Calicut",
    address: "Sunny Diamonds Calicut, Mavoor Rd, Kozhikode, Kerala 673004",
    phone: "+91 97443 55555",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sunny+Diamonds+Calicut+Mavoor+Rd+Kozhikode",
    heroImage: "/images/products/delivery-store/book-visit-hero.png",
  },
  {
    id: "thrissur",
    tabLabel: "THRISSUR",
    storeName: "Thrissur",
    address: "Sunny Diamonds Thrissur, MG Rd, Thrissur, Kerala 680001",
    phone: "+91 97443 55555",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sunny+Diamonds+Thrissur+MG+Rd",
    heroImage: "/images/products/delivery-store/book-visit-hero.png",
  },
  {
    id: "coimbatore",
    tabLabel: "COIMBATORE",
    storeName: "Coimbatore",
    address: "Sunny Diamonds Coimbatore, Cross Cut Rd, Coimbatore, Tamil Nadu 641012",
    phone: "+91 97443 55555",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sunny+Diamonds+Coimbatore+Cross+Cut+Rd",
    heroImage: "/images/products/delivery-store/book-visit-hero.png",
  },
];
