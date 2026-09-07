import type { BookStoreVisitStore } from "../data/bookStoreVisitContent";
import type { NormalizedGenericFormShowroom } from "@/services/forms/generic-form.types";
import type { NormalizedStoreLocatorShowroom } from "@/services/store-locator/store-locator-page.types";
import type { ShowroomSectionLocation } from "@/types/homepage/editorialBlocks";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  extractPincodeFromAddress,
  inferStateFromAddress,
} from "@/features/stores/utils/storeLocatorFilters";

function cleanText(value?: string | null): string {
  return value?.trim() ?? "";
}

export function getDefaultBookStoreVisitStoreId(stores: BookStoreVisitStore[]): string {
  return stores[0]?.id ?? "";
}

export function mapStoreLocatorShowroomToBookStoreVisit(
  showroom: NormalizedStoreLocatorShowroom,
): BookStoreVisitStore {
  return {
    id: showroom.id,
    documentId: showroom.documentId,
    tabLabel: showroom.name.toUpperCase(),
    storeName: showroom.name,
    address: showroom.address,
    phone: showroom.phone ?? "",
    directionsUrl: showroom.mapUrl,
    ...(showroom.desktopImageUrl ? { heroImage: showroom.desktopImageUrl } : {}),
    ...(showroom.mobileImageUrl ? { mobileHeroImage: showroom.mobileImageUrl } : {}),
    imageAlt: showroom.imageAlt,
    city: showroom.city ?? undefined,
    state: showroom.state ?? inferStateFromAddress(showroom.address),
    pincode: extractPincodeFromAddress(showroom.address),
  };
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
    ...(showroom.heroImage ? { heroImage: showroom.heroImage } : {}),
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
    resolveCmsMediaUrl(location.image?.mobileImage);

  const mobileHeroImage = resolveCmsMediaUrl(location.image?.mobileImage);

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
    ...(heroImage ? { heroImage } : {}),
    ...(mobileHeroImage ? { mobileHeroImage } : {}),
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

  const fromEditorial = editorialShowrooms
    .map(mapEditorialShowroomToBookStoreVisit)
    .filter((store): store is BookStoreVisitStore => store != null);

  return fromEditorial;
}

export function resolveBookStoreVisitStoresForPanel(
  variant: "embedded" | "page" | "modal",
  initialStores: BookStoreVisitStore[] | undefined,
  genericFormShowrooms: NormalizedGenericFormShowroom[],
  editorialShowrooms: ShowroomSectionLocation[],
): BookStoreVisitStore[] {
  if (variant === "page") {
    return initialStores ?? [];
  }

  if (initialStores && initialStores.length > 0) {
    return initialStores;
  }

  return resolveBookStoreVisitStores(genericFormShowrooms, editorialShowrooms);
}
