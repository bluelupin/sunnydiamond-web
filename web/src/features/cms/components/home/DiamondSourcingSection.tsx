"use client";

import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useParallax } from "@/shared/hooks/use-parallax";
import { useDiamondSourcingSection } from "@/hooks/homepage/useDiamondSourcingSection";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import diamondGif from "@/assets/diamond-gif.gif";
import diamondSourcingBg from "@/assets/section3-bg.webp";
import DiamondsImg from "@/assets/flawless-diamond-transparent.webp";
interface DiamondSourcingSectionProps {
  id?: string;
}

const DiamondSourcingSection = ({ id }: DiamondSourcingSectionProps) => {
  const ref = useFadeIn();
  const bgParallax = useParallax<HTMLDivElement>(0.25);
  const diamondParallax = useParallax<HTMLDivElement>(-0.45);

  const { data, isLoading } = useDiamondSourcingSection();
  const section = data?.diamondSourcingSection ?? null;
  const sectionTitle = section?.sectionTitle?.trim();
  const isActive = section?.isActive === true;

  // const diamondUrl = getCmsAssetUrl(section?.diamondImage?.data?.attributes?.url);

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

  if (!isActive) {
    return null;
  }

  // if (!diamondUrl) {
  //   return null;
  // }

  return (
    <section
      id={id}
      ref={ref}
      aria-label="Internally flawless diamonds"
      className="relative h-700 overflow-hidden"
    >
      <div className="absolute inset-0 -z-0 will-change-transform" ref={bgParallax}>
        <OptimizedImage
          src={diamondSourcingBg}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-90 scale-110"
        />
        <div className="absolute inset-0 bg-background/40" aria-hidden />
      </div>
      <div className="relative container h-full py-12 md:py-16 flex flex-col items-center justify-center text-center">
        <OptimizedImage
          src={diamondGif}
          alt=""
          width={64}
          height={64}
          className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 opacity-80"
        />
        <h2 className="mt-6 lg:text-5xl md:text-4xl text-32 font-light text-darkblack font-larken max-w-2xl leading-tight tracking-[0%]">
          {sectionTitle}
        </h2>
        <div ref={diamondParallax} className="will-change-transform md:mt-26 mt-76">
          <OptimizedImage
            src={DiamondsImg}
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

