"use client";

import Image from "next/image";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useParallax } from "@/shared/hooks/use-parallax";
import diamondsImg from "@/assets/section3-bg.webp";
import diamondSourcingImage from "@/assets/flawless-diamond-transparent.webp";
import diamondGif from "@/assets/diamond-gif.gif";

type DiamondSourcingSectionData = {
  id?: number;
  sectionTitle?: string;
  description?: string;
  isActive?: boolean;
};
interface DiamondSourcingSectionProps {
  id?: string;
  diamondSourcingSection?: DiamondSourcingSectionData | null;
  isLoading?: boolean;
}

const DiamondSourcingSection = ({
  id,
  diamondSourcingSection,
  isLoading,
}: DiamondSourcingSectionProps) => {
  const ref = useFadeIn();
  const bgParallax = useParallax<HTMLDivElement>(0.25);
  const diamondParallax = useParallax<HTMLDivElement>(-0.45);

  const sectionTitle = diamondSourcingSection?.sectionTitle?.trim();
  const isActive = diamondSourcingSection?.isActive === true;

  if (isLoading) {
    return (
      <section
        id={id}
        ref={ref}
        aria-label="Internally flawless diamonds"
        aria-busy="true"
        className="relative h-700 overflow-hidden"
      >
        <div className="absolute inset-0 -z-0">
          <div className="w-full h-full bg-gray100" />
        </div>
        <div className="relative container h-full py-12 md:py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray200 rounded-full" />
          <div className="mt-6 h-10 w-[min(520px,90%)] bg-gray200 rounded" />
          <div className="mt-10 h-72 w-72 bg-gray200 rounded-full" />
        </div>
      </section>
    );
  }

  if (!isActive || !sectionTitle) {
    return null;
  }

  return (
    <section
      id={id}
      ref={ref}
      aria-label="Internally flawless diamonds"
      className="relative h-700 overflow-hidden"
    >
      {/* Background image (slow parallax) */}
      <div className="absolute inset-0 -z-0 will-change-transform" ref={bgParallax}>
        <OptimizedImage
          src={diamondsImg}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-90 scale-110"
        />
        {/* subtle white wash for text legibility */}
        <div className="absolute inset-0 bg-background/40" aria-hidden />
      </div>
      <div className="relative container h-full py-12 md:py-16 flex flex-col items-center justify-center text-center">
        <Image
          src={diamondGif}
          alt="Diamond Gif Icon"
          width={64}
          height={64}
          className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 opacity-80"
        />
        <h2 className="mt-6 lg:text-5xl md:text-4xl text-32 font-light text-darkblack font-larken max-w-2xl leading-tight tracking-[0%]">
          {sectionTitle}
        </h2>
        <div ref={diamondParallax} className="will-change-transform md:mt-26 mt-76">
          <OptimizedImage
            src={diamondSourcingImage}
            alt="Brilliant round-cut diamond sourced from Belgium"
            width={1024}
            height={1024}
            className="md:w-290 md:h-290 w-[243px] h-[293px]"
          />
        </div>
      </div>
    </section>
  );
};

export default DiamondSourcingSection;

