"use client";

import { useEffect, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ShowroomSectionSkeleton from "@/features/cms/components/SkeletonLoader/ShowroomSectionSkeleton";

import fallBackImage from "@/assets/fallBackImage.png";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

interface ShowroomsSectionProps {
  id?: string;
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
      setActiveId(locations[0].id);
    }
  }, [locations, activeId]);

  const activeLocation =
    locations.find((location) => location.id === activeId) ??
    locations[0];
  const desktopImage = activeLocation?.image?.desktopImage
    ? resolveCmsMediaUrl(activeLocation.image.desktopImage)
    : fallBackImage;

  const mobileImage = activeLocation?.image?.mobileImage
    ? resolveCmsMediaUrl(activeLocation.image.mobileImage)
    : desktopImage;

  const imageAlt =
    activeLocation?.image?.altText ||
    resolveCmsAltText(activeLocation?.image?.desktopImage) ||
    resolveCmsAltText(activeLocation?.image?.mobileImage) ||
    `Sunny Diamonds showroom in ${activeLocation?.name}`;
  if (isLoading) {
    return <ShowroomSectionSkeleton />;
  }

  if (!showroomSection?.isActive) {
    return null;
  }

  return (
    <section
      id={id}
      className="bg-gray200 py-10 sm:py-12 md:py-16 lg:py-20 lg:h-846 md:h-auto h-auto"
    >
      <div className="2xl:pl-24 lg:pl-20 pl-5 lg:pr-0 pr-5">
        <h2 className="lg:text-5xl md:text-4xl text-32 text-black font-larken font-light tracking-[0%] leading-[100%] mb-4 sm:mb-6 md:mb-8 lg:mb-10 lg:text-left text-center">
          {showroomSection.sectionTitle}
        </h2>
        <p className="lg:hidden font-body text-base text-muted-foreground leading-relaxed max-w-350 mx-auto lg:text-left text-center mb-4">
          {showroomSection.description}
        </p>
      </div>
      <div className="lg:grid grid-cols-1 lg:grid-cols-2 gap-[14px] md:gap-5 lg:gap-6 items-start lg:static relative">
        <div
          aria-label="Showroom locations"
          className="lg:px-0 px-5 lg:mb-0 mb-[14px] flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-gray600 overflow-x-auto"
        >
          {locations.map((location) => {
            const isSelected = location.id === activeId;
            return (
              <div
                key={location.id}
                className={cn(
                  "2xl:pl-24 lg:pl-20 lg:w-full w-fit lg:pr-4 lg:border-r-[3px] lg:border-b-0 border-b-[3px] transition-all duration-300",
                  isSelected
                    ? "border-black bg-gray300"
                    : "border-transparent"
                )}
              >
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveId(location.id)}
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
                      <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-[130%] font-gill">
                        {location.address}
                      </p>
                    </div>

                    <div className="mt-4 lg:mb-6 mb-8 flex lg:gap-6 gap-3 items-center">
                      <Phone
                        size={16}
                        className="text-black flex-shrink-0"
                      />
                      <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-[130%] font-gill">
                        {location.phone}
                      </p>
                    </div>

                    <Link
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit md:text-base text-xs pb-1 tracking-[1.8%] leading-[100%] uppercase text-darkblack border-b border-foreground font-gill"
                    >
                      Get Directions
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side Image */}
        <div className="relative lg:aspect-[850/600] aspect-[350/480] lg:h-595 h-478 w-full overflow-hidden lg:px-0 px-5">
          {activeLocation && (
            <ResponsiveImage
              key={activeLocation.id}
              desktopSrc={desktopImage || fallBackImage}
              mobileSrc={mobileImage || fallBackImage}
              alt={imageAlt}
              priority
              width={desktopImage ? 850 : 350}
              height={desktopImage ? 600 : 480}
              quality={90}
              className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700 ease-out"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ShowroomsSection;