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

import fallBackImage from "@/assets/fallBackImage.png";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { isSectionActive } from "@/shared/utils/cmsSection";
import type { ShowroomSectionLocation } from "@/types/homepage/editorialBlocks";

interface ShowroomsSectionProps {
  id?: string;
}

const ADDRESS_ICON = "/images/products/delivery-store/address-icon.svg";
const PHONE_ICON = "/images/products/delivery-store/phone-icon.svg";

function resolveShowroomImages(location: ShowroomSectionLocation | undefined) {
  const desktopImage =
    (location?.image?.desktopImage
      ? resolveCmsMediaUrl(location.image.desktopImage)
      : undefined) ?? fallBackImage;

  const mobileImage =
    (location?.image?.mobileImage
      ? resolveCmsMediaUrl(location.image.mobileImage)
      : undefined) ?? desktopImage;

  const imageAlt =
    resolveCmsAltText(location?.image?.desktopImage) ||
    resolveCmsAltText(location?.image?.mobileImage) ||
    `Sunny Diamonds showroom in ${location?.name}`;

  return { desktopImage, mobileImage, imageAlt };
}

function ShowroomLocationDetails({
  location,
  className,
}: {
  location: ShowroomSectionLocation;
  className?: string;
}) {
  const directionsUrl = location.mapUrl ?? location.directionsUrl ?? "#";

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
            className="size-6 shrink-0"
          />
          <p className="font-gill text-xl font-light leading-110 text-darkblack">
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
          <p className="font-gill text-xl font-light leading-110 text-darkblack">
            {location.phone}
          </p>
        </div>
      </div>
      <Link
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        GET DIRECTIONS
      </Link>
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
    <div className="flex flex-col items-center gap-8 py-16 lg:hidden">
      <ScrollReveal
        as="h2"
        delayMs={0}
        className="w-full px-4 text-center font-larken text-32 font-light leading-110 text-darkblack"
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
          const { mobileImage, desktopImage, imageAlt } =
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
                  <div className="relative aspect-[2500/1797] w-full overflow-hidden">
                    <ResponsiveImage
                      desktopSrc={desktopImage || fallBackImage}
                      mobileSrc={mobileImage || fallBackImage}
                      alt={imageAlt}
                      width={2500}
                      height={1797}
                      quality={90}
                      className="h-full w-full object-cover"
                    />
                  </div>
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
}: {
  locations: ShowroomSectionLocation[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
  sectionTitle?: string | null;
  description?: string | null;
  activeLocation: ShowroomSectionLocation | undefined;
  desktopImage: string | StaticImageData;
  mobileImage: string | StaticImageData;
  imageAlt: string;
}) {
  return (
    <>
      <div className="hidden lg:block 2xl:pl-24 lg:pl-20 pl-5 lg:pr-0 pr-5">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="mb-8 text-center font-larken text-32 font-light leading-110 text-black md:text-4xl lg:mb-40 lg:text-left lg:text-5xl"
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
        <ScrollReveal delayMs={120} className="lg:px-0 px-5 lg:mb-0 mb-[14px]">
          <div
            aria-label="Showroom locations"
            className="flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-gray600 overflow-x-auto"
          >
            {locations.map((location) => {
              const isSelected = location.id === activeId;

              return (
                <div
                  key={location.id}
                  className={cn(
                    "2xl:pl-24 lg:pl-20 lg:w-full w-fit lg:pr-4 border-b-[3px] lg:border-b-0 transition-all duration-300",
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
                      "w-full lg:h-73 h-50 lg:px-0 px-6 flex items-center lg:justify-start justify-center lg:text-left text-center font-larken text-base md:text-xl lg:text-2xl text-black uppercase transition-all duration-300",
                      isSelected
                        ? "font-normal border-b border-gray50"
                        : "font-light"
                    )}
                  >
                    {location.name}
                  </button>

                  {isSelected && (
                    <div className="lg:py-4 py-5 lg:px-0 px-5 lg:w-full sm:w-311 w-[80%] animate-in fade-in duration-300 lg:static absolute bottom-3 left-8 z-10 bg-gray300">
                      <div className="flex lg:gap-6 gap-3 items-start">
                        <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-130 font-gill">
                          {location.address}
                        </p>
                      </div>

                      <div className="mt-4 lg:mb-6 mb-8 flex lg:gap-6 gap-3 items-center">
                        <Phone
                          size={16}
                          className="text-black flex-shrink-0"
                        />
                        <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-130 font-gill">
                          {location.phone}
                        </p>
                      </div>

                      <Link
                        href={
                          location.mapUrl ?? location.directionsUrl ?? "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link-underline block w-fit pb-1 font-gill text-xs uppercase leading-110 tracking-[1.8%] text-darkblack border-b border-foreground md:text-base"
                      >
                        GET DIRECTIONS
                      </Link>
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
          {activeLocation && (
            <ResponsiveImage
              key={activeLocation.id}
              desktopSrc={desktopImage || fallBackImage}
              mobileSrc={mobileImage || fallBackImage}
              alt={imageAlt}
              width={desktopImage ? 850 : 350}
              height={desktopImage ? 600 : 480}
              quality={90}
              className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700 ease-out"
            />
          )}
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
      ? [...showroomSection.showrooms]
          .filter((item) => item?.isActive)
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
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

  const { desktopImage, mobileImage, imageAlt } =
    resolveShowroomImages(activeLocation);

  if (isLoading) {
    return <ShowroomSectionSkeleton />;
  }

  if (!isSectionActive(showroomSection?.isActive) || !showroomSection) {
    return null;
  }

  return (
    <section
      id={id}
      className="bg-gray200 lg:py-20 lg:h-846 md:h-auto h-auto"
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
      />
    </section>
  );
};

export default ShowroomsSection;
