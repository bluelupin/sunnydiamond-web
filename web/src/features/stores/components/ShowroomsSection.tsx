"use client";

import { useEffect, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ShowroomSectionSkeleton from "@/features/cms/components/SkeletonLoader/ShowroomSectionSkeleton";

import showroomCalicut from "@/assets/showroom-calicut.jpg";
import showroomKochi from "@/assets/showroom-kochi.jpg";
import showroomThrissur from "@/assets/showroom-thrissur.jpg";
import showroomCoimbatore from "@/assets/showroom-coimbatore.jpg";
import showroomTrivandrum from "@/assets/showroom-trivandrum.jpg";

interface ShowroomsSectionProps {
  id?: string;
}

const showroomImages = {
  kochi: showroomKochi,
  calicut: showroomCalicut,
  thrissur: showroomThrissur,
  coimbatore: showroomCoimbatore,
  trivandrum: showroomTrivandrum,
};

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

  const activeImage =
    activeLocation?.slug &&
      activeLocation.slug in showroomImages
      ? showroomImages[
      activeLocation.slug as keyof typeof showroomImages
      ]
      : showroomCalicut;

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
        {/* Left Side */}
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
        <div className="relative aspect-auto lg:aspect-auto lg:h-595 h-478 overflow-hidden lg:px-0 px-5">
          {activeLocation && (
            <ResponsiveImage
              key={activeLocation.id}
              desktopSrc={activeImage}
              alt={`Sunny Diamonds showroom in ${activeLocation.name}`}
              priority
              width={1280}
              height={896}
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
// "use client";

// import { useState } from "react";
// import { Phone } from "lucide-react";
// import OptimizedImage from "@/shared/ui/OptimizedImage";
// import { cn } from "@/shared/utils/cn";
// import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
// import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
// import { homeContent } from "@/features/cms/data/content";
// import Link from "next/link";
// import showroomCalicut from "@/assets/showroom-calicut.jpg";
// import ResponsiveImage from "@/shared/ui/ResponsiveImage";
// import ShowroomSectionSkeleton from "@/features/cms/components/SkeletonLoader/ShowroomSectionSkeleton";

// interface ShowroomsSectionProps {
//   id?: string;
// }

// const ShowroomsSection = ({ id }: ShowroomsSectionProps) => {
//   // const { showrooms } = homeContent;
//   const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
//   const showroomSection = editorialData?.showroomSection ?? null;
//   const sectionTitle = showroomSection?.sectionTitle?.trim();
//   const description = showroomSection?.description?.trim();
//   const isActive = showroomSection?.isActive === true;

//   const locations = Array.isArray(showroomSection?.locations)
//     ? [...showroomSection.locations]
//       .filter((l) => l?.isActive !== false)
//       .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
//     : [];

//   const [activeId, setActiveId] = useState<string>(locations?.[0]?.id ?? "");

//   const activeLocation =
//     locations.find((l) => l?.id === activeId) ??
//     locations[0];

//   if (!isActive) return null;
//   if (isEditorialLoading) return <ShowroomSectionSkeleton />;

//   return (
//     <section
//       id={id}
//       className="bg-gray200 py-10 sm:py-12 md:py-16 lg:py-20 lg:h-846 md:h-auto h-auto"
//     >
//       <div className="2xl:pl-24 lg:pl-20 pl-5 lg:pr-0 pr-5">
//         <h2 className="lg:text-5xl md:text-4xl text-32 text-black font-larken font-light tracking-[0%] leading-[100%] mb-4 sm:mb-6 md:mb-8 lg:mb-10 lg:text-left text-center">
//           {sectionTitle}
//         </h2>
//         <p className="lg:hidden font-body text-base text-muted-foreground leading-relaxed max-w-350 mx-auto lg:text-left text-center mb-4">
//           {description}
//         </p>
//       </div>
//       <div className="lg:grid grid-cols-1 lg:grid-cols-2 gap-[14px] md:gap-5 lg:gap-6 items-start lg:static relative">
//         <div aria-label="Showroom locations" className="lg:px-0 px-5 lg:mb-0 mb-[14px] flex lg:flex-col flex-row lg:border-r lg:border-b-0 border-b border-gray600 overflow-x-auto">
//           {showroomSection?.showrooms?.map((location: any) => {
//             const isActive = location.id === activeId;
//             return (
//               <div key={location.id}
//                 className={cn(
//                   "2xl:pl-24 lg:pl-20 lg:w-full w-fit lg:pr-4 lg:border-r-[3px] lg:border-b-0 border-b-[3px] transition-all duration-300",
//                   isActive
//                     ? "border-black bg-gray300"
//                     : "border-transparent",
//                 )}>
//                 <button
//                   type="button"
//                   aria-pressed={isActive}
//                   onClick={() => setActiveId(location.id)}
//                   className={cn(
//                     "w-full lg:h-73 h-50 lg:px-0 px-6 flex items-center lg:justify-start justify-center lg:text-left text-center font-larken text-base md:text-xl lg:text-2xl text-left text-black tracking-[0%] leading-[100%] uppercase transition-all duration-300",
//                     isActive ? "font-normal border-b border-gray50" : "font-light",
//                   )}
//                 >
//                   {location.name}
//                 </button>
//                 {isActive && (
//                   <div
//                     className="lg:py-4 py-5 lg:px-0 px-5 lg:w-full sm:w-311 w-[80%] animate-in fade-in duration-300 lg:static absolute bottom-3 left-8 z-10 bg-gray300"
//                   >
//                     <div className="flex lg:gap-6 gap-3 items-start">
//                       <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"
//                         className="w-7 h-7 text-black flex-shrink-0">
//                         <path d="M16.402 22.133H16.3478C16.1492 22.1211 15.9601 22.0438 15.81 21.9132C15.6598 21.7827 15.557 21.6061 15.5176 21.4111L14.1278 14.5796C14.0925 14.4062 14.0069 14.247 13.8817 14.1218C13.7566 13.9967 13.5974 13.9111 13.4239 13.8757L6.59249 12.486C6.39708 12.4472 6.22001 12.3448 6.08889 12.1948C5.95776 12.0448 5.87995 11.8557 5.86758 11.6568C5.85522 11.458 5.909 11.2607 6.02054 11.0956C6.13208 10.9305 6.2951 10.807 6.48419 10.7443L20.9232 5.93428C21.0853 5.86735 21.2633 5.8491 21.4356 5.88174C21.6079 5.91439 21.7669 5.99651 21.8933 6.11809C22.0197 6.23966 22.1079 6.39541 22.1471 6.56631C22.1864 6.7372 22.175 6.91584 22.1144 7.08037L17.3044 21.5194C17.2416 21.7062 17.1194 21.8673 16.9565 21.9781C16.7935 22.0889 16.5988 22.1433 16.402 22.133Z" fill="#0A0A0A" />
//                       </svg>
//                       <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-[130%] font-gill">
//                         {location.address}
//                       </p>
//                     </div>
//                     <div className="mt-4 lg:mb-6 mb-8 flex lg:gap-6 gap-3 items-center">
//                       <Phone size={16} className=" text-black flex-shrink-0" />
//                       <p className="lg:text-xl md:text-lg text-base text-darkblack font-light tracking-[2%] leading-[130%] font-gill">{location.phone}</p>
//                     </div>
//                     <Link
//                       href={location.mapUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="block w-fit md:text-base text-xs pb-1 tracking-[1.8%] leading-[100%] uppercase text-darkblack border-b border-foreground font-gill transition-colors"
//                     >
//                       Get Directions
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         {/* Right: Image */}
//         <div className="relative aspect-auto lg:aspect-auto lg:h-595 h-478 overflow-hidden lg:px-0 px-5">
//           {/* {activeLocation && ( */}
//           <ResponsiveImage
//             // key={activeLocation.id}
//             desktopSrc={showroomCalicut || ""}
//             alt={`Sunny Diamonds showroom in`}
//             priority
//             width={1280}
//             height={896}
//             quality={90}
//             className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700 ease-out"
//           />
//           {/* )} */}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShowroomsSection;
