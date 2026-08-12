"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { resolveEngravingPreviewTypography } from "@/features/products/constants/engraving";
import { getImageSrc } from "@/shared/utils/image";
import { cn } from "@/shared/utils/cn";

type EngravingPreviewImageProps = {
  /** Magento engraving preview asset (ring close-up). */
  previewImage?: string | StaticImageData;
  /** Current PDP product image — background context for the engraving. */
  productImage?: string | StaticImageData;
  text: string;
  font: string;
};

const EngravingPreviewImage = ({
  previewImage,
  productImage,
  text,
  font,
}: EngravingPreviewImageProps) => {
  const displayText = text.trim();
  const typography = resolveEngravingPreviewTypography(font);

  const productSrc = productImage ? getImageSrc(productImage) : null;
  const previewSrc = previewImage ? getImageSrc(previewImage) : null;
  const layeredPreview = Boolean(productSrc && previewSrc && productSrc !== previewSrc);

  return (
    <div
      className="relative h-250 w-full shrink-0 overflow-hidden bg-aboutInactive"
      aria-label={displayText ? `Engraving preview: ${displayText}` : "Engraving preview"}
    >
      {productImage ? (
        <Image
          src={productImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 424px"
        />
      ) : null}

      {layeredPreview && previewImage ? (
        <Image
          src={previewImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 424px"
        />
      ) : !productImage && previewImage ? (
        <Image
          src={previewImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 424px"
        />
      ) : null}

      {displayText ? (
        <p
          className={cn(
            "pointer-events-none absolute left-1/2 top-[58%] z-10 w-full max-w-[85%] -translate-x-1/2 -translate-y-1/2 truncate text-center leading-none tracking-[0.02em] text-darkblack",
            typography.className,
            displayText.length <= 7 ? "text-2xl" : "text-xl",
          )}
          style={typography.style}
          aria-hidden
        >
          {displayText}
        </p>
      ) : null}
    </div>
  );
};

export default EngravingPreviewImage;
