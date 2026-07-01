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
  const baseSize = layout.diamondBaseSize;
  const diamondScale = diamondPx / baseSize;
  const frameHeight = 300;
  const diamondCenterX = layout.diamondLeft + baseSize / 2;
  const diamondCenterY = ((layout.diamondTop + baseSize / 2) / layout.handAreaHeight) * frameHeight;

  return (
    <div
      className="pointer-events-none relative h-[300px] w-full shrink-0 self-start overflow-hidden"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute left-0 top-0 inset-0 overflow-hidden"
      // style={{ opacity: educationCaratVisualSpec.handOpacity }}
      >
        <div className="h-[300px] sm:w-[500px] w-[350px]">
          <Image
            src={educationPageImages.caratHand}
            alt=""
            fill
            className="object-cover !static sm:!w-[500px] !w-[350px] sm:!h-[475px] !h-[300px]"
          // sizes="100vw"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-10 transition-transform duration-300 ease-out sm:left-[200px] sm:top-[127px] left-[150px] top-[85px]"
        style={{
          // left: `250px`,
          // top: `100px`,
          // left: `${(diamondCenterX / layout.frameWidth) * 100}%`,
          // top: `${(diamondCenterY / frameHeight) * 100}%`,
          width: `${(baseSize / layout.frameWidth) * 100}%`,
          aspectRatio: "1",
          transform: `scale(${diamondScale})`,
          transformOrigin: "center center",
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
