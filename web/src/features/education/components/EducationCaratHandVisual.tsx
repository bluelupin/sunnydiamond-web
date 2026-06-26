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
  const scaledSize = layout.diamondBaseSize * (activeCarat / educationCaratVisualSpec.referenceCarat);
  const diamondPx = Math.min(
    Math.max(scaledSize, layout.diamondMinSize),
    layout.diamondMaxSize,
  );
  const diamondWidthPercent = (diamondPx / layout.frameWidth) * 100;

  return (
    <div
      className="relative mx-auto w-full max-w-[311px] overflow-visible lg:max-w-[528px]"
      style={{ aspectRatio: `${layout.frameWidth} / ${layout.handAreaHeight}` }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: educationCaratVisualSpec.handOpacity }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[248%] w-[172%] origin-center"
          style={{ transform: "translate(-58%, -46%) rotate(-124.75deg) scaleY(-1)" }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                transform: "scale(2.06) translate(-51%, -10.5%)",
                transformOrigin: "center center",
              }}
            >
              <Image
                src={educationPageImages.caratHand}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 311px, 528px"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-10 transition-[width] duration-300 ease-out"
        style={{
          left: `${(layout.diamondLeft / layout.frameWidth) * 100}%`,
          top: `${(layout.diamondTop / layout.handAreaHeight) * 100}%`,
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
