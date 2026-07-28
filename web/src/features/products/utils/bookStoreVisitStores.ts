import type { BookStoreVisitStore } from "../data/bookStoreVisitContent";
import { BOOK_STORE_VISIT_STORES } from "../data/bookStoreVisitContent";
import type { NormalizedGenericFormShowroom } from "@/services/forms/generic-form.types";
import type { ShowroomSectionLocation } from "@/types/homepage/editorialBlocks";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  extractPincodeFromAddress,
  inferStateFromAddress,
} from "@/features/stores/utils/storeLocatorFilters";

const FALLBACK_HERO_IMAGE = "/images/products/delivery-store/book-visit-hero.png";

function cleanText(value?: string | null): string {
  return value?.trim() ?? "";
}

export function mapGenericFormShowroomToBookStoreVisit(
  showroom: NormalizedGenericFormShowroom,
): BookStoreVisitStore {
  return {
    id: showroom.id,
    documentId: showroom.documentId,
    tabLabel: showroom.tabLabel,
    storeName: showroom.storeName,
    address: showroom.address,
    phone: showroom.phone,
    directionsUrl: showroom.directionsUrl,
    heroImage: showroom.heroImage,
    city: showroom.city,
    state: showroom.state ?? inferStateFromAddress(showroom.address),
    pincode: showroom.pincode ?? extractPincodeFromAddress(showroom.address),
  };
}

export function mapEditorialShowroomToBookStoreVisit(
  location: ShowroomSectionLocation,
): BookStoreVisitStore | null {
  if (location.isActive === false) {
    return null;
  }

  const storeName = cleanText(location.name);
  if (!storeName) {
    return null;
  }

  const id =
    location.id != null
      ? String(location.id)
      : storeName.toLowerCase().replace(/\s+/g, "-");

  const heroImage =
    resolveCmsMediaUrl(location.image?.desktopImage) ??
    resolveCmsMediaUrl(location.image?.mobileImage) ??
    FALLBACK_HERO_IMAGE;

  const directionsUrl =
    cleanText(location.mapUrl) ||
    cleanText(location.directionsUrl) ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeName)}`;

  const address = cleanText(location.address) || storeName;

  return {
    id,
    tabLabel: storeName.toUpperCase(),
    storeName,
    address,
    phone: cleanText(location.phone),
    directionsUrl,
    heroImage,
    state: inferStateFromAddress(address),
    pincode: extractPincodeFromAddress(address),
  };
}

export function resolveBookStoreVisitStores(
  genericFormShowrooms: NormalizedGenericFormShowroom[],
  editorialShowrooms: ShowroomSectionLocation[],
): BookStoreVisitStore[] {
  if (genericFormShowrooms.length > 0) {
    return genericFormShowrooms.map(mapGenericFormShowroomToBookStoreVisit);
  }

  const fromEditorial = [...editorialShowrooms]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapEditorialShowroomToBookStoreVisit)
    .filter((store): store is BookStoreVisitStore => store != null);

  if (fromEditorial.length > 0) {
    return fromEditorial;
  }

  return BOOK_STORE_VISIT_STORES;
}
