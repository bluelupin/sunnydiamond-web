import Image from "next/image";
import Link from "next/link";
import { HomepageTrustBadgeSection } from "../common/TrustBadges";
import HeroBackgroundMedia from "./HeroBackgroundMedia";
import HeroSectionOverlay from "./HeroSectionOverlay";
import type { ResolvedHeroContent } from "@/lib/homepage/resolveHomepageAboveFold";

type HeroSectionProps = {
  id?: string;
  hero: ResolvedHeroContent | null;
};

const HeroSection = ({ id, hero }: HeroSectionProps) => {
  if (!hero) {
    return null;
  }

  return (
    <section
      id={id}
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <HeroBackgroundMedia
          desktopImageUrl={hero.desktopImageUrl}
          mobileImageUrl={hero.mobileImageUrl}
          desktopAlt={hero.desktopHeroAlt}
          mobileAlt={hero.mobileHeroAlt}
          cmsVideoUrl={hero.heroVideoUrl}
        />
        <HeroSectionOverlay />
        <div className="container relative flex h-full items-end justify-center md:py-16 sm:py-12 py-11 md:px-6 px-4">
          <div className="flex w-full max-w-886 animate-fade-in flex-col items-center md:gap-8 gap-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 font-gill text-base font-semibold leading-110 text-white">
                <span className="relative size-6 shrink-0 overflow-clip" aria-hidden>
                  <span className="absolute inset-[12.5%_4.17%_15.63%_8.33%]">
                    <span className="absolute inset-[-2.9%_-2.38%]">
                      <Image
                        src="/images/home/hero-eyebrow-diamond.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="block size-full max-w-none"
                      />
                    </span>
                  </span>
                </span>
                <span>{hero.eyebrow}</span>
              </div>
              <h1 className="max-w-886 font-larken xl:text-6xl md:text-5xl sm:text-4xl text-32 font-light leading-110 text-white">
                {hero.titleLines.map((line, index) => (
                  <span key={`${line}-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            {hero.primaryCtaUrl && hero.primaryCtaLabel ? (
              <Link
                href={hero.primaryCtaUrl}
                className="bg-white relative flex items-center justify-center px-7 h-14 overflow-hidden font-gill text-sm font-normal uppercase leading-110 group w-fit"
              >
                <div className="absolute left-0 top-full z-0 h-14 w-full bg-darkblack transition-all duration-300 group-hover:top-0" />
                <span className="relative z-10 text-darkblack transition-all duration-300 group-hover:text-white">
                  {hero.primaryCtaLabel}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <HomepageTrustBadgeSection />
    </section>
  );
};

export default HeroSection;
