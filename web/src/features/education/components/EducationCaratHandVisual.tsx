"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  educationCaratVisualSpec,
  educationPageImages,
} from "../data/content";

type EducationCaratHandVisualProps = {
  activeCarat: number;
};

const EducationCaratHandVisual = ({ activeCarat }: EducationCaratHandVisualProps) => {
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
  const { minCarat, maxCarat } = educationCaratVisualSpec;
  const caratRange = maxCarat - minCarat;
  const normalizedCarat =
    caratRange > 0 ? Math.min(Math.max((activeCarat - minCarat) / caratRange, 0), 1) : 0;
  const diamondPx =
    layout.diamondMinSize + normalizedCarat * (layout.diamondMaxSize - layout.diamondMinSize);
  const frameHeight = 300;
  const diamondWidthPercent = (diamondPx / layout.frameWidth) * 100;
  const diamondLeftPercent =
    ((layout.frameWidth - layout.diamondLeft - diamondPx) / layout.frameWidth) * 100;

  return (
    <div
      className="pointer-events-none relative h-[300px] w-full shrink-0 self-start overflow-hidden"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: educationCaratVisualSpec.handOpacity }}
      >
        <div className="absolute left-0 top-[5%] h-[259%] w-[259%] origin-left-top -scale-x-100 rotate-[60deg] scale-[1.4]">
          <Image
            src={educationPageImages.caratHand}
            alt=""
            fill
            className="object-cover object-left-top"
            sizes="100vw"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-10 transition-[width,left] duration-300 ease-out"
        style={{
          left: `${diamondLeftPercent}%`,
          top: `${(layout.diamondTop / frameHeight) * 100}%`,
          width: `${diamondWidthPercent}%`,
          aspectRatio: "1",
        }}
      >
        <Image
          src={educationPageImages.caratDiamond}
          alt=""
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
    </div>
  );
};

export default EducationCaratHandVisual;
