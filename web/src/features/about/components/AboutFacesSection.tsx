"use client";

import type { CSSProperties } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedAboutTeam } from "@/services/about/about-page.types";
import { aboutFacesFigmaSpec } from "../data/content";
import Reveal from "@/shared/Animation/Reveal";

const hideScrollbarStyle: CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

type AboutFacesSectionProps = NormalizedAboutTeam;

const AboutFacesSection = ({ title, description, members }: AboutFacesSectionProps) => {
  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white lg:pb-100 md:pb-20 pb-16"
    >
      <div className="max-w-1920 2xl:px-[60px] lg:px-10 px-4 flex flex-col items-center text-center lg:mb-10 mb-8">
        <div className="flex max-w-full flex-col items-center lg:gap-4 gap-3">
          <Reveal as="h2" direction="up"
            id="about-faces-title"
            className="font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-[40px] text-32"
          >
            {title}
          </Reveal>
          {description ? (
            <Reveal as="p" direction="up" className="font-gill font-light leading-110 text-neutral500 lg:text-xl md:text-lg text-base ">
              {description}
            </Reveal>
          ) : null}
        </div>
      </div>
      <div className="pl-4 md:pl-0">
        <Reveal direction="up"
          className="mt-10 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 lg:h-[600px] md:h-[450px] lg:gap-1 lg:overflow-visible lg:pl-0 [&::-webkit-scrollbar]:hidden"
          style={hideScrollbarStyle}
        >
          {members.map((member, index) => (
            <figure
              key={`${member.name}-${index}`}
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden",
                "lg:h-[600px] h-[450px] w-[343px] md:h-full lg:w-auto lg:min-w-0 lg:basis-0 lg:flex-1",
                "lg:hover:grow-[1.2] transition-[flex-grow] duration-500 ease-in-out",
              )}
            >
              <ResponsiveImage
                desktopSrc={member.image.desktopUrl}
                mobileSrc={member.image.mobileUrl}
                alt={member.image.alt || member.name}
                width={member.image.width ?? 478}
                height={member.image.height ?? 600}
                quality={80}
                sizes="(max-width: 1023px) 343px, 33vw"
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out lg:group-hover:scale-[1.03]"
              />

              <MediaContentOverlay
                gradient={aboutFacesFigmaSpec.overlay.gradient}
                className={cn(
                  "opacity-100 transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100",
                )}
              />
              <figcaption className="absolute bottom-0 left-0 z-10 w-full text-left opacity-100 transition-all duration-500 lg:translate-y-2 lg:px-10 md:px-9 px-8 md:py-16 py-12 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                <div className="flex flex-col items-start gap-2 leading-110">
                  <p className="font-larken xl:text-3xl lg:text-2xl text-xl font-light text-white">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="font-gill xl:text-lg text-base  font-light text-aboutInactive">
                      {member.role}
                    </p>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default AboutFacesSection;
