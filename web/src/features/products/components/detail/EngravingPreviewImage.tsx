"use client";

import { useId } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  resolveEngravingPreviewFontSize,
  resolveEngravingPreviewLayout,
  resolveEngravingPreviewTypography,
} from "@/features/products/constants/engraving";

type EngravingPreviewImageProps = {
  /** Category or Magento engraving preview asset. Omit to hide the preview block. */
  previewImage?: string | StaticImageData;
  /** Jewellery category slug — selects viewBox text path when preview is category-static. */
  categorySlug?: string | null;
  text: string;
  font: string;
};

const EngravingPreviewImage = ({
  previewImage,
  categorySlug,
  text,
  font,
}: EngravingPreviewImageProps) => {
  const displayText = text.trim();
  const typography = resolveEngravingPreviewTypography(font);
  const arcId = useId().replace(/:/g, "");
  const imageSrc =
    typeof previewImage === "string"
      ? previewImage.trim() || null
      : previewImage ?? null;
  const previewImagePath = typeof previewImage === "string" ? previewImage : null;
  const layout = resolveEngravingPreviewLayout(categorySlug, previewImagePath);
  const fontSize = resolveEngravingPreviewFontSize(
    displayText,
    layout.fontSizeScale ?? 1,
  );

  if (!imageSrc) {
    return null;
  }

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
          viewBox={`0 0 ${layout.viewBox.width} ${layout.viewBox.height}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <path id={arcId} d={layout.textArcPath} fill="none" />
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
