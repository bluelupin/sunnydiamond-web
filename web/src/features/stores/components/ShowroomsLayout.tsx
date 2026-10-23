"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import { getImageSrc } from "@/shared/utils/image";
import {
  accordionCollapseInnerClassName,
  accordionCollapsePanelClassName,
} from "@/shared/ui/accordionCollapse";
import { ShowroomsLayoutSkeleton } from "./ShowroomsLayoutSkeleton";
import {
  StoreLocatorAddressIcon,
  StoreLocatorPhoneIcon,
} from "./StoreLocatorShowroomIcons";
import {
  storeLocatorExpandedPanelFigmaSpec,
  storeLocatorExploreNearbyStoresLabelClassName,
  storeLocatorExploreNearbyStoresLabelMarginTop,
  storeLocatorNoAreaFigmaSpec,
  storeLocatorNoAreaSubtitleClassName,
  storeLocatorNoAreaTitleClassName,
  storeLocatorShowroomCityClassName,
  storeLocatorShowroomDetailTextClassName,
  storeLocatorSearchMobileFigmaSpec,
  storeLocatorShowroomsFigmaSpec,
} from "../data/storeLocatorContent";
import { formatAddressWithPincode } from "../utils/storeLocatorFilters";

const figma = storeLocatorShowroomsFigmaSpec;
const expandedPanelFigma = storeLocatorExpandedPanelFigmaSpec;

export type ShowroomLayoutItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
  directionsUrl: string;
  desktopImage?: string | StaticImageData;
  mobileImage?: string | StaticImageData;
  imageAlt: string;
};

function usePreloadShowroomHeroImages(locations: ShowroomLayoutItem[]) {
  const heroImageUrlsKey = useMemo(() => {
    return locations
      .map((location) => getImageSrc(location.desktopImage) ?? "")
      .filter(Boolean)
      .join("\u0001");
  }, [locations]);

  useEffect(() => {
    for (const src of heroImageUrlsKey.split("\u0001")) {
      if (!src) continue;
      const img = new window.Image();
      img.src = src;
    }
  }, [heroImageUrlsKey]);
}

/** All hero images stay mounted; active layer toggles instantly (no opacity animation). */
function ShowroomHeroStack({
  locations,
  activeId,
  className,
  imageSizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  locations: ShowroomLayoutItem[];
  activeId: string | null;
  className?: string;
  imageSizes?: string;
}) {
  const layers = useMemo(
    () => locations.filter((location) => location.desktopImage),
    [locations],
  );
  const resolvedActiveId = activeId ?? layers[0]?.id ?? null;

  if (layers.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden bg-gray100", className)}>
      {layers.map((location) => {
        const isActive = location.id === resolvedActiveId;

        return (
          <div
            key={location.id}
            className={cn(
              "absolute inset-0",
              isActive ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!isActive}
          >
            <ResponsiveImage
              fill
              desktopSrc={location.desktopImage!}
              mobileSrc={location.mobileImage ?? location.desktopImage!}
              alt={location.imageAlt}
              sizes={imageSizes}
              quality={80}
              eager
              className="object-cover object-center"
            />
          </div>
        );
      })}
    </div>
  );
}

function toShowroomTelHref(phone: string): string | undefined {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export type ShowroomsLayoutProps = {
  locations: ShowroomLayoutItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  description?: string | null;
  getDirectionsLabel?: string;
  listHeader?: ReactNode;
  /** Figma 4903:141556 — pin / location miss with full showroom list */
  noAreaCopy?: { title: string; subtitle: string } | null;
  matchedStoreIds?: string[];
  nearbyStoresLabel?: string;
  emptyMessage?: string;
  className?: string;
  isLoading?: boolean;
};

function ShowroomPhoneRow({ phone }: { phone: string }) {
  const href = toShowroomTelHref(phone);
  if (!phone.trim()) return null;

  const textClassName = storeLocatorShowroomDetailTextClassName;

  return (
    <div
      className="flex w-full items-center text-darkblack"
      style={{ gap: expandedPanelFigma.iconTextGap }}
    >
      <StoreLocatorPhoneIcon />
      {href ? (
        <a href={href} className={cn(textClassName, "shrink-0 no-underline")}>
          {phone}
        </a>
      ) : (
        <p className={cn(textClassName, "shrink-0")}>{phone}</p>
      )}
    </div>
  );
}

function ShowroomLocationDetailsFigma({
  location,
  getDirectionsLabel,
}: {
  location: ShowroomLayoutItem;
  getDirectionsLabel?: string;
}) {
  const directionsText = getDirectionsLabel?.trim() || "GET DIRECTIONS";

  return (
    <div
      className="flex w-full flex-col items-start"
      style={{ gap: expandedPanelFigma.detailsToCtaGap }}
    >
      <div
        className="flex w-full flex-col items-start"
        style={{ gap: expandedPanelFigma.contactStackGap }}
      >
        {location.address ? (
          <div
            className="flex w-full items-start text-darkblack"
            style={{ gap: expandedPanelFigma.iconTextGap }}
          >
            <StoreLocatorAddressIcon />
            <p className={cn("min-w-0 flex-1", storeLocatorShowroomDetailTextClassName)}>
              {location.address}
            </p>
          </div>
        ) : null}
        {location.phone ? <ShowroomPhoneRow phone={location.phone} /> : null}
      </div>
      {location.directionsUrl ? (
        <DetailTextLink
          href={location.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {directionsText}
        </DetailTextLink>
      ) : null}
    </div>
  );
}

function ShowroomExpandedPanel({
  location,
  getDirectionsLabel,
  includeMobileImage = false,
  horizontalPadding = figma.listHorizontalPadding,
}: {
  location: ShowroomLayoutItem;
  getDirectionsLabel?: string;
  includeMobileImage?: boolean;
  horizontalPadding?: number;
}) {
  return (
    <div
      className="flex w-full flex-col"
      style={{
        gap: expandedPanelFigma.sectionGap,
        backgroundColor: figma.expandedPanelBackground,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: figma.expandedPanelPaddingY,
        paddingBottom: figma.expandedPanelPaddingY,
      }}
    >
      <p className={storeLocatorShowroomCityClassName}>{location.name}</p>
      <div className="h-[0.5px] w-full bg-neutral300" aria-hidden />
      {includeMobileImage && location.desktopImage ? (
        <div className="relative aspect-[2500/1797] w-full overflow-hidden bg-gray100">
          <ResponsiveImage
            desktopSrc={location.desktopImage}
            mobileSrc={location.mobileImage ?? location.desktopImage}
            alt={location.imageAlt}
            width={2500}
            height={1797}
            quality={80}
            eager
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <ShowroomLocationDetailsFigma location={location} getDirectionsLabel={getDirectionsLabel} />
    </div>
  );
}

/** Desktop store locator — same pattern as homepage showrooms: city row + inline details when selected. */
function ShowroomDesktopInlineListItem({
  location,
  isSelected,
  onSelect,
  getDirectionsLabel,
  horizontalPadding = figma.listHorizontalPadding,
}: {
  location: ShowroomLayoutItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  getDirectionsLabel?: string;
  horizontalPadding?: number;
}) {
  return (
    <div
      className={cn("w-full transition-all duration-300", isSelected && "bg-gray300")}
      style={{
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        ...(isSelected ? { backgroundColor: figma.expandedPanelBackground } : {}),
      }}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(location.id)}
        className={cn(
          "flex w-full items-center text-left transition-all duration-300",
          storeLocatorShowroomCityClassName,
          isSelected && "border-b border-gray50",
        )}
        style={{
          paddingTop: figma.collapsedRowPaddingY,
          paddingBottom: isSelected ? 10 : figma.collapsedRowPaddingY,
        }}
      >
        {location.name}
      </button>

      {isSelected ? (
        <div
          className="animate-in fade-in duration-300"
          style={{
            paddingTop: figma.expandedPanelPaddingY,
            paddingBottom: figma.expandedPanelPaddingY,
          }}
        >
          <ShowroomLocationDetailsFigma
            location={location}
            getDirectionsLabel={getDirectionsLabel}
          />
        </div>
      ) : null}
    </div>
  );
}

function ShowroomNoAreaListLead({
  copy,
  featuredLocation,
  getDirectionsLabel,
  horizontalPadding = figma.listHorizontalPadding,
  includeMobileImage = false,
}: {
  copy: { title: string; subtitle: string };
  featuredLocation?: ShowroomLayoutItem;
  getDirectionsLabel?: string;
  horizontalPadding?: number;
  includeMobileImage?: boolean;
}) {
  const pad = {
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
  };

  return (
    <div
      className="flex w-full flex-col"
      style={{ gap: storeLocatorNoAreaFigmaSpec.titleToSubtitleGap }}
    >
      <p className={storeLocatorNoAreaTitleClassName} style={pad}>
        {copy.title}
      </p>
      <div
        className="flex w-full flex-col"
        style={{ gap: storeLocatorNoAreaFigmaSpec.subtitleToFeaturedGap }}
      >
        <p className={storeLocatorNoAreaSubtitleClassName} style={pad}>
          {copy.subtitle}
        </p>
        {featuredLocation ? (
          <ShowroomExpandedPanel
            location={featuredLocation}
            getDirectionsLabel={getDirectionsLabel}
            includeMobileImage={includeMobileImage}
            horizontalPadding={horizontalPadding}
          />
        ) : null}
      </div>
    </div>
  );
}

function ShowroomMobileAccordionItem({
  location,
  isSelected,
  onSelect,
  getDirectionsLabel,
  horizontalPadding,
}: {
  location: ShowroomLayoutItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  getDirectionsLabel?: string;
  horizontalPadding: number;
}) {
  return (
    <div
      className="w-full"
      style={isSelected ? { backgroundColor: figma.expandedPanelBackground } : undefined}
    >
      <button
        type="button"
        aria-expanded={isSelected}
        onClick={() => onSelect(location.id)}
        className={cn(
          "flex w-full items-center text-left",
          storeLocatorShowroomCityClassName,
          !isSelected && "hover:bg-[#F2F2F2]/60",
        )}
        style={{
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          paddingTop: isSelected ? figma.expandedPanelPaddingY : figma.collapsedRowPaddingY,
          paddingBottom: isSelected ? 12 : figma.collapsedRowPaddingY,
        }}
      >
        {location.name}
      </button>

      <div
        aria-hidden={!isSelected}
        className={accordionCollapsePanelClassName(isSelected)}
      >
        <div className={accordionCollapseInnerClassName}>
          <div
            className="flex w-full flex-col"
            style={{
              gap: expandedPanelFigma.sectionGap,
              paddingLeft: horizontalPadding,
              paddingRight: horizontalPadding,
              paddingBottom: figma.expandedPanelPaddingY,
            }}
          >
            <div className="h-[0.5px] w-full bg-neutral300" aria-hidden />
            {location.desktopImage ? (
              <div className="relative aspect-[2500/1797] w-full overflow-hidden bg-gray100">
                <ResponsiveImage
                  desktopSrc={location.desktopImage}
                  mobileSrc={location.mobileImage ?? location.desktopImage}
                  alt={location.imageAlt}
                  width={2500}
                  height={1797}
                  quality={80}
                  eager
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <ShowroomLocationDetailsFigma
              location={location}
              getDirectionsLabel={getDirectionsLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowroomsMobileAccordion({
  locations,
  activeId,
  onSelect,
  getDirectionsLabel,
  listHeader,
  noAreaCopy,
  emptyMessage,
}: Pick<
  ShowroomsLayoutProps,
  | "locations"
  | "activeId"
  | "onSelect"
  | "getDirectionsLabel"
  | "listHeader"
  | "noAreaCopy"
  | "emptyMessage"
>) {
  const mobilePadding = storeLocatorSearchMobileFigmaSpec.paddingX;

  return (
    <div className="flex flex-col items-left gap-4 bg-white lg:hidden">
      {listHeader || noAreaCopy ? (
        <div className="w-full pt-6">
          {noAreaCopy ? (
            <ShowroomNoAreaListLead
              copy={noAreaCopy}
              horizontalPadding={mobilePadding}
            />
          ) : (
            <div className="w-full px-4">{listHeader}</div>
          )}
        </div>
      ) : null}

      <div className="w-full" aria-label="Showroom locations">
        {locations.length === 0 ? (
          emptyMessage ? (
            <p className="px-4 py-6 font-gill text-center text-base font-light leading-110 text-neutral500">
              {emptyMessage}
            </p>
          ) : null
        ) : (
          locations.map((location) => (
            <ShowroomMobileAccordionItem
              key={location.id}
              location={location}
              isSelected={location.id === activeId}
              onSelect={onSelect}
              getDirectionsLabel={getDirectionsLabel}
              horizontalPadding={mobilePadding}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ShowroomsDesktopLayout({
  locations,
  activeId,
  onSelect,
  getDirectionsLabel,
  listHeader,
  noAreaCopy,
  emptyMessage,
  matchedStoreIds,
  nearbyStoresLabel,
}: Pick<
  ShowroomsLayoutProps,
  | "locations"
  | "activeId"
  | "onSelect"
  | "getDirectionsLabel"
  | "listHeader"
  | "noAreaCopy"
  | "emptyMessage"
  | "matchedStoreIds"
  | "nearbyStoresLabel"
>) {
  const matchedIdSet = new Set(matchedStoreIds ?? []);
  const matchedCount = matchedStoreIds?.length ?? 0;
  const showNearbyLabel = Boolean(
    nearbyStoresLabel?.trim() && matchedCount > 0 && locations.length > matchedCount,
  );
  let lastMatchedIndex = -1;
  if (showNearbyLabel) {
    for (let i = 0; i < locations.length; i += 1) {
      if (matchedIdSet.has(locations[i].id)) {
        lastMatchedIndex = i;
      }
    }
  }
  const exploreNearbyInsertIndex =
    showNearbyLabel && lastMatchedIndex >= 0 && lastMatchedIndex < locations.length - 1
      ? lastMatchedIndex + 1
      : -1;

  const activeLocation =
    locations.find((location) => location.id === activeId) ?? locations[0] ?? null;

  return (
    <div
      className="mx-auto hidden w-full max-w-1920 lg:grid lg:grid-cols-[minmax(0,593px)_minmax(0,1fr)] lg:items-stretch"
      style={{
        gap: figma.columnGap,
        paddingTop: figma.sectionPaddingTop,
        paddingBottom: figma.sectionPaddingBottom,
      }}
    >
      <div className="flex w-full min-w-0 flex-col" style={{ maxWidth: figma.listMaxWidth }}>
        {noAreaCopy ? (
          <ShowroomNoAreaListLead copy={noAreaCopy} getDirectionsLabel={getDirectionsLabel} />
        ) : listHeader ? (
          <div
            className="w-full"
            style={{
              paddingLeft: figma.listHorizontalPadding,
              paddingRight: figma.listHorizontalPadding,
              marginBottom: figma.listTitleToListGap,
            }}
          >
            {listHeader}
          </div>
        ) : null}

        <div
          aria-label="Showroom locations"
          className="flex w-full flex-col border-r border-neutral300"
        >
          {locations.length === 0 ? (
            emptyMessage ? (
              <p
                className="py-8 font-gill text-base font-light leading-110 text-neutral500"
                style={{
                  paddingLeft: figma.listHorizontalPadding,
                  paddingRight: figma.listHorizontalPadding,
                }}
              >
                {emptyMessage}
              </p>
            ) : null
          ) : (
            locations.map((location, index) => {
              const isSelected = location.id === activeId;
              const insertNearbyLabel = index === exploreNearbyInsertIndex;

              return (
                <div key={location.id} className="w-full">
                  {insertNearbyLabel ? (
                    <div
                      className="flex w-full items-center"
                      style={{
                        marginTop: storeLocatorExploreNearbyStoresLabelMarginTop,
                        paddingLeft: figma.listHorizontalPadding,
                        paddingRight: figma.listHorizontalPadding,
                      }}
                    >
                      <p className={storeLocatorExploreNearbyStoresLabelClassName}>
                        {nearbyStoresLabel}
                      </p>
                    </div>
                  ) : null}

                  <ShowroomDesktopInlineListItem
                    location={location}
                    isSelected={isSelected}
                    onSelect={onSelect}
                    getDirectionsLabel={getDirectionsLabel}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div
        className="relative h-full min-w-0 overflow-hidden"
        style={{ minHeight: figma.heroMinHeight }}
      >
        {activeLocation?.desktopImage ? (
          <div className="absolute inset-0 bg-gray100">
            <ResponsiveImage
              key={activeLocation.id}
              fill
              desktopSrc={activeLocation.desktopImage}
              mobileSrc={activeLocation.mobileImage ?? activeLocation.desktopImage}
              alt={activeLocation.imageAlt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={80}
              eager
              className="object-cover object-center animate-in fade-in zoom-in-105 duration-700 ease-out"
            />
          </div>
        ) : (
          <ShowroomHeroStack locations={locations} activeId={activeId} className="absolute inset-0" />
        )}
      </div>
    </div>
  );
}

export function ShowroomsLayout({
  locations,
  activeId,
  onSelect,
  getDirectionsLabel,
  listHeader,
  noAreaCopy,
  matchedStoreIds,
  nearbyStoresLabel,
  emptyMessage,
  className,
  isLoading = false,
}: ShowroomsLayoutProps) {
  usePreloadShowroomHeroImages(locations);

  if (isLoading) {
    return (
      <ShowroomsLayoutSkeleton
        className={className}
        showListHeader={Boolean(listHeader || noAreaCopy)}
      />
    );
  }

  return (
    <section className={cn("bg-white pb-16 lg:pb-0", className)}>
      <ShowroomsMobileAccordion
        locations={locations}
        activeId={activeId}
        onSelect={onSelect}
        getDirectionsLabel={getDirectionsLabel}
        listHeader={listHeader}
        noAreaCopy={noAreaCopy}
        emptyMessage={emptyMessage}
      />
      <ShowroomsDesktopLayout
        locations={locations}
        activeId={activeId}
        onSelect={onSelect}
        getDirectionsLabel={getDirectionsLabel}
        listHeader={listHeader}
        noAreaCopy={noAreaCopy}
        emptyMessage={emptyMessage}
        matchedStoreIds={matchedStoreIds}
        nearbyStoresLabel={nearbyStoresLabel}
      />
    </section>
  );
}

export function mapBookStoreVisitStoreToLayoutItem(store: {
  id: string;
  storeName: string;
  address: string;
  phone: string;
  directionsUrl: string;
  heroImage?: string;
  mobileHeroImage?: string;
  imageAlt?: string;
  pincode?: string;
}): ShowroomLayoutItem {
  return {
    id: store.id,
    name: store.storeName,
    address: formatAddressWithPincode(store.address, store.pincode),
    phone: store.phone,
    directionsUrl: store.directionsUrl,
    ...(store.heroImage ? { desktopImage: store.heroImage } : {}),
    ...(store.mobileHeroImage ?? store.heroImage
      ? { mobileImage: store.mobileHeroImage ?? store.heroImage }
      : {}),
    imageAlt: store.imageAlt ?? "",
  };
}
