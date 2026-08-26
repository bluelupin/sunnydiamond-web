"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import ShowroomSectionSkeleton from "@/features/cms/components/SkeletonLoader/ShowroomSectionSkeleton";

import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { isSectionActive } from "@/shared/utils/cmsSection";
import type { ShowroomSectionLocation } from "@/types/homepage/editorialBlocks";

interface ShowroomsSectionProps {
  id?: string;
}

const ADDRESS_ICON = "/icons/address-icon.svg";
const PHONE_ICON = "/icons/phone-icon.svg";

function resolveShowroomImages(location: ShowroomSectionLocation | undefined) {
  const desktopImage = location?.image?.desktopImage
    ? resolveCmsMediaUrl(location.image.desktopImage)
    : undefined;

  const mobileImage = location?.image?.mobileImage
    ? resolveCmsMediaUrl(location.image.mobileImage)
    : desktopImage;

  const imageAlt = resolveCmsAltText(location?.image?.desktopImage) ?? "";

  return {
    desktopImage,
    mobileImage,
    imageAlt,
    hasImage: Boolean(desktopImage || mobileImage),
  };
}

function ShowroomLocationDetails({
  location,
  className,
}: {
  location: ShowroomSectionLocation;
  className?: string;
}) {
  const directionsUrl = location.mapUrl ?? location.directionsUrl ?? "";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-4">
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
      </div>
      {directionsUrl ? (
        <Link
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          GET DIRECTIONS
        </Link>
      ) : null}
    </div>
  );
}

function ShowroomsMobileAccordion({
  locations,
  activeId,
  onSelect,
  sectionTitle,
}: {
  locations: ShowroomSectionLocation[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
  sectionTitle?: string | null;
}) {
  return (
    <div className="flex flex-col items-left gap-8 bg-white py-16 lg:hidden">
      <ScrollReveal
        as="h2"
        delayMs={0}
        className="w-full px-4 font-larken text-32 font-light leading-110 text-darkblack"
      >
        {sectionTitle}
      </ScrollReveal>

      <ScrollReveal
        delayMs={80}
        className="w-full border-r-[0.5px] border-neutral300"
        aria-label="Showroom locations"
      >
        {locations.map((location) => {
          const isSelected = location.id === activeId;
          const { mobileImage, desktopImage, imageAlt, hasImage } =
            resolveShowroomImages(location);

          return (
            <div key={location.id} className="w-full">
              {isSelected ? (
                <div className="flex w-full flex-col gap-4 bg-gray300 px-4 py-6">
                  <p className="font-larken text-xl font-light leading-110 text-darkblack">
                    {location.name}
                  </p>
                  <div
                    className="h-[0.5px] w-full bg-neutral300"
                    aria-hidden
                  />
                  {hasImage && desktopImage && mobileImage ? (
                    <div className="relative aspect-[2500/1797] w-full overflow-hidden">
                      <ResponsiveImage
                        desktopSrc={desktopImage}
                        mobileSrc={mobileImage}
                        alt={imageAlt}
                        width={2500}
                        height={1797}
                        quality={90}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <ShowroomLocationDetails location={location} />
                </div>
              ) : (
                <button
                  type="button"
                  aria-pressed={false}
                  onClick={() => onSelect(location.id ?? null)}
                  className="flex w-full items-center px-4 py-6 text-left font-larken text-xl font-light leading-110 text-darkblack"
                >
                  {location.name}
                </button>
              )}
            </div>
          );
        })}
      </ScrollReveal>
    </div>
  );
}

function ShowroomsDesktopLayout({
  locations,
  activeId,
  onSelect,
  sectionTitle,
  description,
  activeLocation,
  desktopImage,
  mobileImage,
  imageAlt,
  hasImage,
}: {
  locations: ShowroomSectionLocation[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
  sectionTitle?: string | null;
  description?: string | null;
  activeLocation: ShowroomSectionLocation | undefined;
  desktopImage?: string | StaticImageData;
  mobileImage?: string | StaticImageData;
  imageAlt: string;
  hasImage: boolean;
}) {
  return (
    <>
      <div className="hidden lg:block 2xl:pl-24 lg:pl-10 pl-5 lg:pr-0 pr-5">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="mb-8 text-center font-larken text-32 font-light leading-110 text-black md:text-4xl lg:mb-10 lg:text-left lg:text-5xl"
        >
          {sectionTitle}
        </ScrollReveal>
        {description ? (
          <ScrollReveal
            delayMs={80}
            className="md:hidden font-body text-base text-muted-foreground leading-relaxed max-w-350 mx-auto lg:text-left text-center mb-4"
          >
            {description}
          </ScrollReveal>
        ) : null}
      </div>
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-[14px] md:gap-5 lg:gap-6 items-start lg:static relative">
        <ScrollReveal delayMs={120} className="lg:px-0 px-5 lg:mb-0 mb-[14px] h-full">
          <div
            aria-label="Showroom locations"
            className="h-full flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-neutral300 overflow-x-auto"
          >
            {locations.map((location) => {
              const isSelected = location.id === activeId;

              return (
                <div
                  key={location.id}
                  className={cn(
                    "2xl:pl-24 lg:pl-10 lg:w-full w-fit lg:pr-4 border-b-[3px] lg:border-b-0 transition-all duration-300",
                    isSelected
                      ? "border-black bg-gray300"
                      : "border-transparent"
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelect(location.id ?? null)}
                    className={cn(
                      "font-light w-full lg:h-73 h-50 lg:px-0 px-6 flex items-center lg:justify-start justify-center lg:text-left text-center font-larken text-base md:text-xl lg:text-2xl text-darkblack transition-all duration-300",
                      isSelected && "border-b border-gray50"
                    )}
                  >
                    {location.name}
                  </button>

                  {isSelected && (
                    <div className="lg:pt-4 lg:pb-8 py-5 lg:px-0 px-5 lg:w-full sm:w-311 w-[80%] animate-in fade-in duration-300 lg:static absolute bottom-3 left-8 z-10 bg-gray300">
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

                      <div className="mt-4 lg:mb-6 mb-8 flex gap-3 items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black flex-shrink-0">
                          <path d="M18 20V3.5C18 2.67157 17.3284 2 16.5 2L7.5 2C6.67157 2 6 2.67157 6 3.5L6 20C6 20.8284 6.67157 21.5 7.5 21.5H16.5C17.3284 21.5 18 20.8284 18 20Z" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 6.3125C12.5178 6.3125 12.9375 5.89277 12.9375 5.375C12.9375 4.85723 12.5178 4.4375 12 4.4375C11.4822 4.4375 11.0625 4.85723 11.0625 5.375C11.0625 5.89277 11.4822 6.3125 12 6.3125Z" fill="#0A0A0A" />
                        </svg>
                        <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-130 font-gill">
                          {location.phone}
                        </p>
                      </div>
                      {(location.mapUrl ?? location.directionsUrl) ? (
                        <Link href={location.mapUrl ?? location.directionsUrl ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tertiary-cta-underline cursor-pointer sm:pb-1 font-gill md:text-base text-xs uppercase leading-110 tracking-[1.8%]">
                          GET DIRECTIONS
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal
          delayMs={200}
          className="relative aspect-[350/480] h-478 w-full overflow-hidden px-5 md:aspect-[850/600] md:h-595 md:px-0 lg:aspect-[850/600]"
        >
          {activeLocation && hasImage && desktopImage && mobileImage ? (
            <ResponsiveImage
              key={activeLocation.id}
              desktopSrc={desktopImage}
              mobileSrc={mobileImage}
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

const ShowroomsSection = ({ id }: ShowroomsSectionProps) => {
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const showroomSection = editorialData?.showroomSection;

  const locations = useMemo(() => {
    return Array.isArray(showroomSection?.showrooms)
      ? showroomSection.showrooms.filter((item) => item?.isActive)
      : [];
  }, [showroomSection?.showrooms]);

  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (locations.length > 0 && activeId === null) {
      setActiveId(locations[0].id ?? null);
    }
  }, [locations, activeId]);

  const activeLocation =
    locations.find((location) => location.id === activeId) ?? locations[0];

  const { desktopImage, mobileImage, imageAlt, hasImage } =
    resolveShowroomImages(activeLocation);

  if (isLoading) {
    return <ShowroomSectionSkeleton />;
  }

  if (!isSectionActive(showroomSection?.isActive) || !showroomSection || locations.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="bg-white lg:bg-gray200 lg:py-20 lg:h-846 md:h-auto h-auto"
    >
      <ShowroomsMobileAccordion
        locations={locations}
        activeId={activeId}
        onSelect={setActiveId}
        sectionTitle={showroomSection.sectionTitle}
      />
      <ShowroomsDesktopLayout
        locations={locations}
        activeId={activeId}
        onSelect={setActiveId}
        sectionTitle={showroomSection.sectionTitle}
        description={showroomSection.description}
        activeLocation={activeLocation}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        imageAlt={imageAlt}
        hasImage={hasImage}
      />
    </section>
  );
};

export default ShowroomsSection;
