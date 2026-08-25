"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import { ShowroomsLayoutSkeleton } from "./ShowroomsLayoutSkeleton";

const ADDRESS_ICON = "/icons/address-icon.svg";
const PHONE_ICON = "/icons/phone-icon.svg";

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
  emptyMessage?: string;
  className?: string;
  isLoading?: boolean;
};

function ShowroomLocationDetails({
  location,
  getDirectionsLabel,
  className,
}: {
  location: ShowroomLayoutItem;
  getDirectionsLabel?: string;
  className?: string;
}) {
  const directionsText = getDirectionsLabel?.trim();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {location.address ? (
        <div className="flex items-start gap-3">
          <Image
            src={ADDRESS_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden
            className="lg:size-6 size-5 shrink-0 sm:mt-0 mt-1.5"
          />
          <p className="font-gill lg:text-xl text-lg font-light leading-110 text-darkblack">
            {location.address}
          </p>
        </div>
      ) : null}
      {location.phone ? (
        <div className="flex items-center gap-3">
          <Image
            src={PHONE_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden
            className="size-6 shrink-0"
          />
          <p className="font-gill lg:text-xl text-lg font-light leading-110 text-darkblack">
            {location.phone}
          </p>
        </div>
      ) : null}
      {directionsText && location.directionsUrl ? (
        <Link
          href={location.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {directionsText}
        </Link>
      ) : null}
    </div>
  );
}

function ShowroomsMobileAccordion({
  locations,
  activeId,
  onSelect,
  getDirectionsLabel,
  listHeader,
  emptyMessage,
}: Pick<
  ShowroomsLayoutProps,
  | "locations"
  | "activeId"
  | "onSelect"
  | "getDirectionsLabel"
  | "listHeader"
  | "emptyMessage"
>) {
  return (
    <div className="flex flex-col items-left lg:gap-8 gap-4 bg-white lg:hidden">
      {listHeader ? <div className="w-full px-4">{listHeader}</div> : null}

      <ScrollReveal
        delayMs={80}
        className="w-full"
        aria-label="Showroom locations"
      >
        {locations.length === 0 ? (
          emptyMessage ? (
            <p className="px-4 py-6 font-gill text-center text-base font-light leading-110 text-neutral500">
              {emptyMessage}
            </p>
          ) : null
        ) : (
          locations.map((location) => {
            const isSelected = location.id === activeId;

            return (
              <div key={location.id} className="w-full">
                {isSelected ? (
                  <div className="flex w-full flex-col gap-4 bg-gray300 px-4 py-6">
                    <p className="font-larken text-xl font-light leading-110 text-darkblack">
                      {location.name}
                    </p>
                    <div className="h-[0.5px] w-full bg-neutral300" aria-hidden />
                    {location.desktopImage ? (
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
                    <ShowroomLocationDetails
                      location={location}
                      getDirectionsLabel={getDirectionsLabel}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-pressed={false}
                    onClick={() => onSelect(location.id)}
                    className="flex w-full items-center px-4 py-6 text-left font-larken text-xl font-light leading-110 text-darkblack"
                  >
                    {location.name}
                  </button>
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
  description,
  getDirectionsLabel,
  listHeader,
  emptyMessage,
  activeLocation,
  desktopImage,
  mobileImage,
  imageAlt,
}: Pick<
  ShowroomsLayoutProps,
  | "locations"
  | "activeId"
  | "onSelect"
  | "description"
  | "getDirectionsLabel"
  | "listHeader"
  | "emptyMessage"
> & {
  activeLocation: ShowroomLayoutItem | undefined;
  desktopImage?: string | StaticImageData;
  mobileImage?: string | StaticImageData;
  imageAlt: string;
}) {
  const directionsText = getDirectionsLabel?.trim();
  const hasHeaderContent = Boolean(description || listHeader);

  return (
    <>
      {hasHeaderContent ? (
        <div className="hidden lg:block 2xl:pl-24 lg:pl-10 pl-5 lg:pr-0 pr-5">
          {description ? (
            <ScrollReveal
              delayMs={80}
              className="md:hidden font-body text-base text-muted-foreground leading-relaxed max-w-350 mx-auto lg:text-left text-center mb-4"
            >
              {description}
            </ScrollReveal>
          ) : null}
          {listHeader ? (
            <div className="lg:mb-6 mb-4 text-base text-darkblack font-gill font-normal">{listHeader}</div>
          ) : null}
        </div>
      ) : null}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-[14px] md:gap-5 lg:gap-6 items-start lg:static relative">
        <ScrollReveal delayMs={120} className="lg:px-0 px-5 lg:mb-0 mb-[14px] h-full">
          <div
            aria-label="Showroom locations"
            className="h-full flex lg:flex-col flex-row overflow-x-auto"
          >
            {locations.length === 0 ? (
              emptyMessage ? (
                <p className="px-4 py-8 font-gill text-center text-base font-light leading-110 text-neutral500 lg:px-10">
                  {emptyMessage}
                </p>
              ) : null
            ) : (
              locations.map((location) => {
                const isSelected = location.id === activeId;

                return (
                  <div
                    key={location.id}
                    className={cn(
                      "2xl:pl-24 lg:pl-10 lg:w-full w-fit lg:pr-4 border-b-[3px] lg:border-b-0 transition-all duration-300",
                      isSelected ? "border-black bg-gray300" : "border-transparent",
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onSelect(location.id)}
                      className={cn(
                        "font-light w-full lg:h-73 h-50 lg:px-0 px-6 flex items-center lg:justify-start justify-center lg:text-left text-center font-larken text-base md:text-xl lg:text-2xl text-darkblack transition-all duration-300",
                        isSelected && "border-b border-gray50",
                      )}
                    >
                      {location.name}
                    </button>

                    {isSelected ? (
                      <div className="lg:pt-4 lg:pb-8 py-5 lg:px-0 px-5 lg:w-full sm:w-311 w-[80%] animate-in fade-in duration-300 lg:static absolute bottom-3 left-8 z-10 bg-gray300">
                        {location.address ? (
                          <div className="flex gap-3 items-start">
                            <Image
                              src={ADDRESS_ICON}
                              alt=""
                              width={24}
                              height={24}
                              aria-hidden
                              className="sm:size-5 w-5 h-5 shrink-0 sm:mt-0 mt-1.5"
                            />
                            <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-130 font-gill">
                              {location.address}
                            </p>
                          </div>
                        ) : null}

                        {location.phone ? (
                          <div className="mt-4 lg:mb-6 mb-8 flex gap-3 items-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-black flex-shrink-0"
                              aria-hidden
                            >
                              <path
                                d="M18 20V3.5C18 2.67157 17.3284 2 16.5 2L7.5 2C6.67157 2 6 2.67157 6 3.5L6 20C6 20.8284 6.67157 21.5 7.5 21.5H16.5C17.3284 21.5 18 20.8284 18 20Z"
                                stroke="#0A0A0A"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 6.3125C12.5178 6.3125 12.9375 5.89277 12.9375 5.375C12.9375 4.85723 12.5178 4.4375 12 4.4375C11.4822 4.4375 11.0625 4.85723 11.0625 5.375C11.0625 5.89277 11.4822 6.3125 12 6.3125Z"
                                fill="#0A0A0A"
                              />
                            </svg>
                            <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-130 font-gill">
                              {location.phone}
                            </p>
                          </div>
                        ) : null}
                        {directionsText && location.directionsUrl ? (
                          <Link
                            href={location.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative after:bg-darkMagenta after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack hover:border-darkMagenta sm:pb-1 font-gill md:text-base text-xs uppercase leading-110 tracking-[1.8%] hover:text-darkMagenta"
                          >
                            {directionsText}
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal
          delayMs={200}
          className="relative aspect-[350/480] h-478 w-full overflow-hidden px-5 md:aspect-[850/600] md:h-595 md:px-0 lg:aspect-[850/600]"
        >
          {activeLocation && desktopImage ? (
            <ResponsiveImage
              key={activeLocation.id}
              desktopSrc={desktopImage}
              mobileSrc={mobileImage ?? desktopImage}
              alt={imageAlt}
              width={850}
              height={600}
              quality={90}
              className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700 ease-out"
            />
          ) : null}
        </ScrollReveal>
      </div>
    </>
  );
}

export function ShowroomsLayout({
  locations,
  activeId,
  onSelect,
  description,
  getDirectionsLabel,
  listHeader,
  emptyMessage,
  className,
  isLoading = false,
}: ShowroomsLayoutProps) {
  if (isLoading) {
    return (
      <ShowroomsLayoutSkeleton
        className={className}
        showListHeader={Boolean(listHeader)}
      />
    );
  }

  const activeLocation =
    locations.find((location) => location.id === activeId) ?? locations[0];

  const desktopImage = activeLocation?.desktopImage;
  const mobileImage = activeLocation?.mobileImage ?? desktopImage;
  const imageAlt = activeLocation?.imageAlt ?? "";

  return (
    <section
      className={cn("bg-white lg:pt-16 lg:pb-100 pb-16", className)}
    >
      <ShowroomsMobileAccordion
        locations={locations}
        activeId={activeId}
        onSelect={onSelect}
        getDirectionsLabel={getDirectionsLabel}
        listHeader={listHeader}
        emptyMessage={emptyMessage}
      />
      <ShowroomsDesktopLayout
        locations={locations}
        activeId={activeId}
        onSelect={onSelect}
        description={description}
        getDirectionsLabel={getDirectionsLabel}
        listHeader={listHeader}
        emptyMessage={emptyMessage}
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
  heroImage: string;
  mobileHeroImage?: string;
  imageAlt?: string;
}): ShowroomLayoutItem {
  return {
    id: store.id,
    name: store.storeName,
    address: store.address,
    phone: store.phone,
    directionsUrl: store.directionsUrl,
    ...(store.heroImage ? { desktopImage: store.heroImage } : {}),
    ...(store.mobileHeroImage ?? store.heroImage
      ? { mobileImage: store.mobileHeroImage ?? store.heroImage }
      : {}),
    imageAlt: store.imageAlt ?? "",
  };
}
