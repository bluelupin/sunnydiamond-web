"use client";

import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
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

function toShowroomTelHref(phone: string): string | undefined {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

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
        <div className="relative aspect-[2500/1797] w-full overflow-hidden">
          <ResponsiveImage
            desktopSrc={location.desktopImage}
            mobileSrc={location.mobileImage ?? location.desktopImage}
            alt={location.imageAlt}
            width={2500}
            height={1797}
            quality={90}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <ShowroomLocationDetailsFigma location={location} getDirectionsLabel={getDirectionsLabel} />
    </div>
  );
}

function ShowroomCollapsedRow({
  location,
  onSelect,
  horizontalPadding = figma.listHorizontalPadding,
}: {
  location: ShowroomLayoutItem;
  onSelect: (id: string) => void;
  horizontalPadding?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={false}
      onClick={() => onSelect(location.id)}
      className={cn("flex w-full items-center text-left", storeLocatorShowroomCityClassName)}
      style={{
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: figma.collapsedRowPaddingY,
        paddingBottom: figma.collapsedRowPaddingY,
      }}
    >
      {location.name}
    </button>
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
  const featuredLocation =
    locations.find((location) => location.id === activeId) ?? locations[0];
  const remainingLocations = noAreaCopy
    ? locations.filter((location) => location.id !== featuredLocation?.id)
    : locations;

  return (
    <div className="flex flex-col items-left gap-4 bg-white lg:hidden">
      {listHeader || noAreaCopy ? (
        <div className="w-full pt-6">
          {noAreaCopy ? (
            <ShowroomNoAreaListLead
              copy={noAreaCopy}
              featuredLocation={featuredLocation}
              getDirectionsLabel={getDirectionsLabel}
              horizontalPadding={mobilePadding}
              includeMobileImage
            />
          ) : (
            <div className="w-full px-4">{listHeader}</div>
          )}
        </div>
      ) : null}

      <ScrollReveal delayMs={80} className="w-full" aria-label="Showroom locations">
        {locations.length === 0 ? (
          emptyMessage ? (
            <p className="px-4 py-6 font-gill text-center text-base font-light leading-110 text-neutral500">
              {emptyMessage}
            </p>
          ) : null
        ) : noAreaCopy ? (
          remainingLocations.map((location) => (
            <ShowroomCollapsedRow
              key={location.id}
              location={location}
              onSelect={onSelect}
              horizontalPadding={mobilePadding}
            />
          ))
        ) : (
          locations.map((location) => {
            const isSelected = location.id === activeId;

            return (
              <div key={location.id} className="w-full">
                {isSelected ? (
                  <ShowroomExpandedPanel
                    location={location}
                    getDirectionsLabel={getDirectionsLabel}
                    includeMobileImage
                    horizontalPadding={mobilePadding}
                  />
                ) : (
                  <ShowroomCollapsedRow
                    location={location}
                    onSelect={onSelect}
                    horizontalPadding={mobilePadding}
                  />
                )}
              </div>
            );
          })
        )}
      </ScrollReveal>
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
  activeLocation,
  desktopImage,
  mobileImage,
  imageAlt,
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
> & {
  activeLocation: ShowroomLayoutItem | undefined;
  desktopImage?: string | StaticImageData;
  mobileImage?: string | StaticImageData;
  imageAlt: string;
}) {
  const matchedIdSet = new Set(matchedStoreIds ?? []);
  const matchedLocations = locations.filter((location) => matchedIdSet.has(location.id));
  const matchedCount = matchedLocations.length;
  const showNearbyLabel = Boolean(
    nearbyStoresLabel?.trim() && matchedCount > 0 && locations.length > matchedCount,
  );
  const orderedLocations = showNearbyLabel
    ? [...matchedLocations, ...locations.filter((location) => !matchedIdSet.has(location.id))]
    : locations;
  const featuredLocation =
    orderedLocations.find((location) => location.id === activeId) ?? orderedLocations[0];
  const listLocations = noAreaCopy
    ? orderedLocations.filter((location) => location.id !== featuredLocation?.id)
    : orderedLocations;

  return (
    <div
      className="mx-auto hidden w-full max-w-1920 items-stretch gap-6 lg:flex"
      style={{
        gap: figma.columnGap,
        paddingTop: figma.sectionPaddingTop,
        paddingBottom: figma.sectionPaddingBottom,
      }}
    >
      <ScrollReveal
        delayMs={120}
        className="flex w-full max-w-[593px] shrink-0 flex-col"
        style={{ maxWidth: figma.listMaxWidth }}
      >
        {noAreaCopy ? (
          <ShowroomNoAreaListLead
            copy={noAreaCopy}
            featuredLocation={featuredLocation}
            getDirectionsLabel={getDirectionsLabel}
          />
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

        <div aria-label="Showroom locations" className="flex w-full flex-col">
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
            listLocations.map((location, index) => {
              const isSelected = !noAreaCopy && location.id === activeId;
              const insertNearbyLabel = showNearbyLabel && index === matchedCount;

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

                  {isSelected ? (
                    <ShowroomExpandedPanel
                      location={location}
                      getDirectionsLabel={getDirectionsLabel}
                    />
                  ) : (
                    <ShowroomCollapsedRow location={location} onSelect={onSelect} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal
        delayMs={200}
        className="relative min-w-0 flex-1 basis-0 overflow-hidden"
        style={{ height: figma.heroMinHeight, minHeight: figma.heroMinHeight }}
      >
        {activeLocation && desktopImage ? (
          <ResponsiveImage
            key={activeLocation.id}
            fill
            desktopSrc={desktopImage}
            mobileSrc={mobileImage ?? desktopImage}
            alt={imageAlt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
            className="object-cover object-center"
          />
        ) : null}
      </ScrollReveal>
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
  if (isLoading) {
    return (
      <ShowroomsLayoutSkeleton
        className={className}
        showListHeader={Boolean(listHeader || noAreaCopy)}
      />
    );
  }

  const activeLocation =
    locations.find((location) => location.id === activeId) ?? locations[0];

  const desktopImage = activeLocation?.desktopImage;
  const mobileImage = activeLocation?.mobileImage ?? desktopImage;
  const imageAlt = activeLocation?.imageAlt ?? "";

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
        activeLocation={activeLocation}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        imageAlt={imageAlt}
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
