import type { CSSProperties } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import { aboutFacesContent } from "../data/content";

const hideScrollbarStyle = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
} as CSSProperties;

const AboutFacesSection = () => {
  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white pb-16 md:pb-20 lg:pb-[104px]"
    >
      <div className="container flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-4 max-w-[760px]">
          <h2
            id="about-faces-title"
            className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] leading-[110%] text-darkblack"
          >
            {aboutFacesContent.title}
          </h2>
          <p className="font-gill font-light text-base md:text-lg lg:text-xl leading-[110%] text-gray500">
            {aboutFacesContent.description}
          </p>
        </div>
      </div>

      <div
        className="mt-10 flex w-full gap-1 overflow-x-auto snap-x snap-mandatory pl-4 lg:h-[600px] lg:overflow-visible lg:pl-0 [&::-webkit-scrollbar]:hidden"
        style={hideScrollbarStyle}
      >
        {aboutFacesContent.members.map((member, index) => (
          <figure
            key={member.image}
            className={cn(
              "group relative shrink-0 snap-start overflow-hidden",
              "h-[560px] w-[calc(100vw-24px)]",
              "lg:h-full lg:w-auto lg:basis-0 lg:flex-1",
              "transition-[flex-grow] duration-500 ease-in-out lg:hover:grow-[2.4]",
            )}
          >
            <ResponsiveImage
              desktopSrc={member.image}
              alt={member.alt}
              width={member.width}
              height={member.height}
              quality={90}
              sizes="(max-width: 1023px) calc(100vw - 24px), 33vw"
              className="h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-[1.03]"
              priority={index === 0}
            />

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-100 transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100"
            />

            <figcaption className="absolute bottom-0 left-0 p-5 md:p-6 lg:p-8 text-left opacity-100 translate-y-0 transition-all duration-500 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
              <p className="font-larken font-light text-xl md:text-2xl text-white leading-[110%]">
                {member.name}
              </p>
              <p className="mt-1 font-gill font-light text-xs md:text-sm text-white/80 tracking-[0.12em] uppercase leading-[130%]">
                {member.role}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default AboutFacesSection;
