import Link from "next/link";

import { homeContent } from "@/data/content";
import { getImageSrc } from "@/lib/utils/image";
import hero640 from "@/assets/hero-banner-640.webp";
import hero1024 from "@/assets/hero-banner-1024.webp";
import hero1440 from "@/assets/hero-banner-1440.webp";
import DiamondIcon from "@/assets/Icons/Diamond";

const heroSrcSet = `${getImageSrc(hero640)} 640w, ${getImageSrc(hero1024)} 1024w, ${getImageSrc(hero1440)} 1440w`;

const HeroSection = ({ id }: { id?: string }) => {
  const { hero } = homeContent;
  const marqueeItems = [...hero.trustSignals, ...hero.trustSignals];

  return (
    <>
      <section id={id} className="relative h-screen flex flex-col overflow-hidden">
        <div className="relative flex-1 overflow-hidden">
          {/* Background video — autoplay, muted, looped, no controls */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={getImageSrc(hero1024)}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            {/* Fallback image for browsers without video support */}
            <img
              src={getImageSrc(hero1024)}
              srcSet={heroSrcSet}
              sizes="100vw"
              alt="Premium diamond jewellery collection by Sunny Diamonds"
              width={1440}
              height={700}
              fetchPriority="high"
              decoding="sync"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </video>
          {/* Left/bottom gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/40 to-transparent md:hidden" />
         <div className="relative h-full max-w-[1440px] mx-auto w-full flex items-end pb-12 md:pb-20 lg:pb-24 px-6 md:px-10 lg:px-16">
            <div className="md:max-w-[742px] animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 text-white font-gill font-normal lg:text-xl md:text-lg text-base tracking-[1.8%] uppercase">
                <DiamondIcon className="text-white" />
                <span className="tracking-[1.8%]">
                  {hero.badge}
                </span>
              </div>

              <h1 className="mb-40 lg:text-[54px] md:text-[42px] text-[32px] text-white">
                {hero.title}
              </h1>
              <Link
                href={hero.cta.to}
                className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-white text-white  md:text-base text-sm px-8 md:h-50 h-12 tracking-[0%] uppercase font-gill transition-colors duration-500"
              >
                <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
                <span className="relative z-10 group-hover:text-charcoal transition-colors duration-500">
                  {hero.cta.label}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Trust signals marquee */}
      <div className="bg-gray300 text-ivory border-t border-ivory/10 overflow-hidden shrink-0">
        <div className="relative flex overflow-hidden md:h-16 h-12">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap">
            {marqueeItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill">
                <span className="text-gray500">
                  {item}
                </span>
                <span className="text-gray600" aria-hidden>•</span>
              </div>
            ))}
          </div>
          <div
            aria-hidden
            className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap"
          >
            {marqueeItems.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill">
                <span className="text-gray500">
                  {item}
                </span>
                <span className="text-gray600" aria-hidden>•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
