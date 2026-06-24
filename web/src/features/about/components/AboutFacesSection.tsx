import type { CSSProperties } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import { aboutFacesContent, aboutFacesFigmaSpec } from "../data/content";

const hideScrollbarStyle: CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const AboutFacesSection = () => {
  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white lg:pb-100 md:pb-20 pb-16"
    >
      <div className="container flex flex-col items-center text-center lg:mb-[40px] mb-8">
        <div className="flex max-w-full flex-col items-center lg:gap-4 gap-3">
          <h2
            id="about-faces-title"
            className="font-larken font-light leading-[110%] text-darkblack lg:text-[48px] md:text-[40px] text-[32px]"
          >
            {aboutFacesContent.title}
          </h2>
          <p className="font-gill font-light leading-[110%] text-neutral500 lg:text-xl md:text-lg text-base ">
            {aboutFacesContent.description}
          </p>
        </div>
      </div>
      <div className="lg:pl-0 pl-4">
        <div
          className="mt-10 flex w-full snap-x snap-mandatory lg:gap-1 gap-2 overflow-x-auto pl-4 lg:h-[600px] lg:overflow-visible lg:pl-0 [&::-webkit-scrollbar]:hidden"
          style={hideScrollbarStyle}
        >
          {aboutFacesContent.members.map((member, index) => (
            <figure
              key={index}
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden",
                "h-[560px] lg:w-[calc(100vw-24px)] md:w-[400PX] w-[343px]",
                "lg:h-full lg:w-auto lg:basis-0 lg:flex-1",
                "transition-[flex-grow] duration-500 ease-in-out lg:hover:grow-[1.6]"
              )}
            >
              <ResponsiveImage
                desktopSrc={member.desktopImage}
                mobileSrc={member.mobileImage}
                alt={member.alt}
                width={member.width}
                height={member.height}
                quality={90}
                sizes="(max-width: 1023px) calc(100vw - 24px), 33vw"
                className={`h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-[0.8] ${index === 0 ? "lg:group-hover:scale-[1]" : "lg:group-hover:scale-[1.1]"}`}
              />

              <MediaContentOverlay
                gradient={aboutFacesFigmaSpec.overlay.gradient}
                className={cn(
                  "opacity-100 transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100",
                )}
              />
              <figcaption className="absolute bottom-0 left-0 z-10 w-full px-4 py-8 text-left opacity-100 transition-all duration-500 md:p-6 lg:translate-y-2 lg:px-6 lg:py-12 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:p-8">
                <p className="font-larken font-light md:text-2xl text-xl text-white leading-[110%]">
                  {member.name}
                </p>
                <p className="mt-1 font-gill font-light leading-[130%] tracking-[0.12em] text-white/80 lg:text-xl md:text-lg text-base">
                  {member.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFacesSection;
