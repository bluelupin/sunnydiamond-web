"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { educationCaratVisualSpec } from "../data/content";

type EducationCaratHandVisualProps = {
  activeCarat: number;
  minCarat: number;
  maxCarat: number;
  handDesktopUrl: string;
  handMobileUrl: string;
  handAlt: string;
  diamondImageUrl?: string;
  diamondImageAlt?: string;
};

const EducationCaratHandVisual = ({
  activeCarat,
  minCarat,
  maxCarat,
  handDesktopUrl,
  handMobileUrl,
  handAlt,
  diamondImageUrl,
  diamondImageAlt,
}: EducationCaratHandVisualProps) => {
  const [useMobileLayout, setUseMobileLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setUseMobileLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const layout = useMobileLayout
    ? educationCaratVisualSpec.mobile
    : educationCaratVisualSpec.desktop;

  const caratRange = maxCarat - minCarat;
  const normalizedCarat =
    caratRange > 0 ? Math.min(Math.max((activeCarat - minCarat) / caratRange, 0), 1) : 0;
  const diamondPx =
    layout.diamondMinSize + normalizedCarat * (layout.diamondMaxSize - layout.diamondMinSize);
  const baseSize = layout.diamondBaseSize;
  const diamondScale = diamondPx / baseSize;

  return (
    <div
      className="pointer-events-none relative lg:h-[300px] md:h-300 h-[200px] w-full shrink-0 self-start overflow-hidden"
      aria-hidden
    >
      <div className="pointer-events-none absolute left-0 top-0 inset-0 overflow-hidden">
        <div className="relative h-[350px] sm:w-[600px] w-[350px]">
          <ResponsiveImage
            desktopSrc={handDesktopUrl}
            mobileSrc={handMobileUrl}
            alt={handAlt}
            fill
            className="object-cover !static sm:!w-[650px] !w-[350px] sm:!h-[470px] !h-[300px]"
            sizes="(max-width: 640px) 350px, 650px"
          />
        </div>
      </div>

      {diamondImageUrl ? (
        <div
          className="pointer-events-none absolute z-10 transition-transform duration-300 ease-out sm:left-[250px] sm:top-[120px] left-[150px] top-[85px]"
          style={{
            width: `${(baseSize / layout.frameWidth) * 100}%`,
            aspectRatio: "1",
            transform: `scale(${diamondScale})`,
            transformOrigin: "center center",
          }}
        >
          <Image
            key={diamondImageUrl}
            src={diamondImageUrl}
            alt={diamondImageAlt ?? ""}
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
      ) : null}
    </div>
  );
};

export default EducationCaratHandVisual;
