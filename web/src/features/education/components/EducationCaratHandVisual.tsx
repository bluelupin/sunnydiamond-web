"use client";

import Image from "next/image";
import {
  educationCaratVisualSpec,
  educationPageImages,
} from "../data/content";

type EducationCaratHandVisualProps = {
  activeCarat: number;
};

const EducationCaratHandVisual = ({ activeCarat }: EducationCaratHandVisualProps) => {
  const spec = educationCaratVisualSpec;
  const diamondScale = activeCarat / spec.referenceCarat;
  const diamondPx = Math.max(spec.diamondBaseSize * diamondScale, spec.diamondMinSize);
  const diamondWidthPercent = (diamondPx / spec.frameWidth) * 100;

  return (
    <div
      className="relative mx-auto w-full max-w-[528px] overflow-visible"
      style={{ aspectRatio: `${spec.frameWidth} / ${spec.handAreaHeight}` }}
      aria-hidden
    >
      {/* Figma 692:29043 / 692:29044 — hand illustration */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: spec.handOpacity }}
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
                sizes="528px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Figma 692:29042 — diamond on ring finger, scales with carat */}
      <div
        className="pointer-events-none absolute z-10 transition-[width] duration-300 ease-out"
        style={{
          left: `${(spec.diamondLeft / spec.frameWidth) * 100}%`,
          top: `${(spec.diamondTop / spec.handAreaHeight) * 100}%`,
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
