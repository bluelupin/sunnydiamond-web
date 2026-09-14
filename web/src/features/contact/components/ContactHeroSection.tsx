"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import type { NormalizedContactHero } from "@/services/contact/contact-page.types";
import { contactHeroFigmaSpec } from "../data/contactHeroFigmaSpec";

type ContactHeroSectionProps = {
  hero: NormalizedContactHero;
};

const ContactHeroSection = ({ hero }: ContactHeroSectionProps) => {
  const desktopAlt = hero.image?.desktopAlt?.trim() || hero.title;
  const mobileAlt = hero.image?.mobileAlt?.trim() || hero.title;

  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden bg-white md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-[62%_38%] md:[&_img]:object-[58%_42%] [&_video]:object-[62%_38%] md:[&_video]:object-[58%_42%]">
        <HeroBackgroundMedia
          desktopImageUrl={hero.image?.desktopUrl ?? ""}
          mobileImageUrl={hero.image?.mobileUrl}
          desktopAlt={desktopAlt}
          mobileAlt={mobileAlt}
          cmsVideoUrl={hero.videoUrl}
        />
        <MediaContentOverlay solidOpacity={contactHeroFigmaSpec.overlayOpacity} />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-10 md:inset-x-auto md:left-1/2 md:top-[203px] md:bottom-auto md:-translate-x-1/2 md:px-0 md:pb-0"
      >
        <h1
          id="contact-hero-title"
          className="w-full text-center font-larken text-32 font-light leading-110 text-white md:w-auto md:text-[48px] md:whitespace-nowrap"
        >
          {hero.title}
        </h1>
      </div>
    </section>
  );
};

export default ContactHeroSection;
