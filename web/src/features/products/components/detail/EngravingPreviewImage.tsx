"use client";

import { useId } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  RING_ENGRAVING_PREVIEW_VIEWBOX,
  RING_ENGRAVING_TEXT_ARC_PATH,
  resolveEngravingPreviewFontSize,
  resolveEngravingPreviewTypography,
  resolveRingEngravingPreviewImage,
} from "@/features/products/constants/engraving";

type EngravingPreviewImageProps = {
  /** Magento engraving preview asset (ring close-up). Falls back to Figma ring image. */
  previewImage?: string | StaticImageData;
  text: string;
  font: string;
};

const EngravingPreviewImage = ({
  previewImage,
  text,
  font,
}: EngravingPreviewImageProps) => {
  const displayText = text.trim();
  const typography = resolveEngravingPreviewTypography(font);
  const arcId = useId().replace(/:/g, "");
  const imageSrc =
    typeof previewImage === "string"
      ? resolveRingEngravingPreviewImage(previewImage)
      : previewImage ?? resolveRingEngravingPreviewImage();
  const fontSize = resolveEngravingPreviewFontSize(displayText);

  return (
    <div
      className="relative h-214 w-full shrink-0 overflow-hidden bg-aboutInactive"
      aria-label={displayText ? `Engraving preview: ${displayText}` : "Engraving preview"}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 424px"
      />

      {displayText ? (
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox={`0 0 ${RING_ENGRAVING_PREVIEW_VIEWBOX.width} ${RING_ENGRAVING_PREVIEW_VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <path id={arcId} d={RING_ENGRAVING_TEXT_ARC_PATH} fill="none" />
            <filter id={`${arcId}-etch`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.4" stdDeviation="0" floodColor="#ffffff" floodOpacity="0.35" />
              <feDropShadow dx="0" dy="-0.3" stdDeviation="0" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>
          <text
            fill="#434343"
            fontSize={fontSize}
            fontWeight={500}
            letterSpacing="0.02em"
            style={{ fontFamily: typography.style.fontFamily }}
            filter={`url(#${arcId}-etch)`}
          >
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
              {displayText}
            </textPath>
          </text>
        </svg>
      ) : null}
    </div>
  );
};

export default EngravingPreviewImage;
